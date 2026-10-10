const { request, response } = require("express");

const Venta = require("../models/venta");

const Producto = require("../models/producto");
const AppError = require("../helpers/AppError");
const { logError } = require("../helpers/logger");

const ventasGet = async (req = request, res = response) => {
  const { desde = 0, limite = 10 } = req.query;

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
  let stockDescontado = false;

  try {
    //Verificamos que los productos existan en la BD
    for (const item of items) {
      const productoDB = await Producto.findById(item.producto);

      if (!productoDB) {
        throw new AppError(`El producto ${item.nombre} no existe`, 404);
      }
    }

    // 2. Si todo está OK, descontar el stock de cada producto, permitiendo que baje a 0
    const descontarStock = items.map((item) => {
      return Producto.findByIdAndUpdate(item.producto, {
        $inc: { stock: -item.cantidad },
      });
    });
    await Promise.all(descontarStock);
    stockDescontado = true;

    // 3. Crear la venta comprimida
    const data = {
      items,
      total,
      metodoPago,
      usuario: req.usuario._id,
    };

    const venta = new Venta(data);
    await venta.save();

    res.json({
      mensaje: "Venta realizada con exito y stock actualizado",
    });
  } catch (error) {
    // Si ya se había descontado el stock antes de que fallara el guardado
    // de la venta, lo devolvemos para no dejar el inventario inconsistente.
    if (stockDescontado) {
      try {
        const devolverStock = items.map((item) => {
          return Producto.findByIdAndUpdate(item.producto, {
            $inc: { stock: item.cantidad },
          });
        });
        await Promise.all(devolverStock);
      } catch (rollbackError) {
        logError(rollbackError, req);
      }
    }

    throw error instanceof AppError
      ? error
      : new AppError("Error al procesar la venta", 500);
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

  const venta = await Venta.findById(id);
  if (!venta) {
    throw new AppError("La venta no existe", 404);
  }
  if (!venta.estado) {
    throw new AppError("La venta ya esta anulada", 409);
  }

  // Devolvemos el stock de TODO lo que había en la venta
  const devolverStock = venta.items.map((item) => {
    return Producto.findByIdAndUpdate(item.producto, {
      $inc: { stock: item.cantidad },
    });
  });
  await Promise.all(devolverStock);

  venta.estado = false;
  await venta.save();

  res.json({
    mensaje: "Venta anulada por error de carga. Stock restaurado.",
    venta,
  });
};

module.exports = {
  ventasGet,
  ventaGetID,
  ventaPost,
  ventaPut,
  anularVenta,
};
