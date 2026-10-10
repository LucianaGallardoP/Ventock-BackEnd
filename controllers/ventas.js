const { request, response } = require("express");
const mongoose = require("mongoose");

const Venta = require("../models/venta");

const Producto = require("../models/producto");
const AppError = require("../helpers/AppError");

const ventasGet = async (req = request, res = response) => {
  const desde = Number(req.query.desde ?? 0);
  const limite = Number(req.query.limite ?? 10);

  const query = {
    estado: true,
  };

  const [total, ventas] = await Promise.all([
    Venta.countDocuments(query),
    Venta.find(query)
      .skip(desde)
      .limit(limite)
      .populate("usuario", "nombre apellido")
      .populate("items.producto", "nombre"),
  ]);

  res.json({
    mensaje: "Ventas obtenidas",
    total,
    ventas,
  });
};

const ventaGetID = async (req = request, res = response) => {
  const { id } = req.params;

  const venta = await Venta.findById(id)
    .populate("usuario", "nombre apellido")
    .populate("items.producto", "nombre");

  if (!venta) {
    throw new AppError("Venta no encontrada", 404);
  }

  res.json({
    mensaje: "Venta obtenida con exito.",
    venta,
  });
};

const ventaPost = async (req = request, res = response) => {
  const { items, total, metodoPago } = req.body;

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      for (const item of items) {
        const productoActualizado = await Producto.findOneAndUpdate(
          { _id: item.producto, stock: { $gte: item.cantidad } },
          { $inc: { stock: -item.cantidad } },
          { new: true, session },
        );

        if (!productoActualizado) {
          const existe = await Producto.findById(item.producto).session(
            session,
          );

          if (!existe) {
            throw new AppError(`El producto ${item.nombre} no existe`, 404);
          }

          throw new AppError(
            `Stock insuficiente para "${existe.nombre}" (disponible: ${existe.stock}, pedido: ${item.cantidad})`,
            409,
          );
        }
      }
      const data = {
        items,
        total,
        metodoPago,
        usuario: req.usuario._id,
      };

      await Venta.create([data], { session });
    });

    res.json({
      mensaje: "Venta realizada con exito y stock actualizado",
    });
  } catch (error) {
    throw error instanceof AppError
      ? error
      : new AppError("Error al procesar la venta", 500);
  } finally {
    await session.endSession();
  }
};

const ventaPut = async (req = request, res = response) => {
  const { id } = req.params;
  const { metodoPago } = req.body;

  const venta = await Venta.findByIdAndUpdate(
    id,
    { metodoPago },
    { new: true },
  );

  if (!venta) {
    throw new AppError("Venta no encontrada", 404);
  }

  res.json({
    mensaje: "El método de pago ha sido corregido",
    venta,
  });
};

const anularVenta = async (req = request, res = response) => {
  const { id } = req.params;

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const venta = await Venta.findById(id).session(session);
      if (!venta) {
        throw new AppError("La venta no existe", 404);
      }
      if (!venta.estado) {
        throw new AppError("La venta ya esta anulada", 409);
      }

      const devolverStock = venta.items.map((item) =>
        Producto.findByIdAndUpdate(
          item.producto,
          { $inc: { stock: item.cantidad } },
          { session },
        ),
      );
      await Promise.all(devolverStock);

      venta.estado = false;
      await venta.save({ session });
    });

    const venta = await Venta.findById(id);
    res.json({
      mensaje: "Venta anulada por error de carga. Stock restaurado.",
      venta,
    });
  } catch (error) {
    throw error instanceof AppError
      ? error
      : new AppError("Error al anular la venta.", 500);
  } finally {
    await session.endSession();
  }
};

module.exports = {
  ventasGet,
  ventaGetID,
  ventaPost,
  ventaPut,
  anularVenta,
};
