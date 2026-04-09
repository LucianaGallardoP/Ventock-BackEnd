const { request, response } = require("express");

const Venta = require("../models/venta");

const Producto = require("../models/producto");

const ventasGet = async (req = request, res = response) => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const query = {
    fecharegistro: { $gte: hoy },
    estado: true,
  };

  const [total, ventas] = await Promise.all([
    Venta.countDocuments(query),
    Venta.find(query)
      // .populate("usuario", "nombre apellido")
      .sort({ fechaRegistro: -1 }),
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
    // .populate("usuario", "nombre apellido")
    .populate("items.producto", "nombre");

  if (!venta) return res.json({ mensaje: "Venta no encontrada", venta });
};

const ventaPost = async (req = request, res = response) => {
  const { items, total, metodoPago } = req.body;

  try {
    // 1. Validar que haya stock para todos los productos ANTES de vender
    for (const item of items) {
      const productoDB = await Producto.findById(item.producto);

      if (!productoDB) {
        return res.json({ mensaje: `El producto ${item.nombre} no existe` });
      }

      if (productoDB.stock < item.cantidad) {
        return res.json({
          mensaje: `Stock insuficiente para ${productoDB.nombre}. Disponible: ${productoDB.stock}`,
        });
      }
    }

    // 2. Si todo está OK, descontar el stock de cada producto
    const descontarStock = items.map((item) => {
      return Producto.findByIdAndUpdate(item.producto, {
        $inc: { stock: -item.cantidad },
      });
    });
    await Promise.all(descontarStock);

    // 3. Crear la venta comprimida
    const data = {
      items,
      total,
      metodoPago,
      // usuario:req.usuario._id
    };

    const venta = new Venta(data);
    await venta.save();

    res.json({
      mensaje: "Venta realizada con exito y stock actualizado",
    });
  } catch (error) {
    res.json({
      mensaje: "Error al procesar la venta",
    });
  }
};

const ventaPut = async (req = request, res = response) => {
  const { id } = req.params;
  const { metodoPago } = req.body;

  // Solo permitimos actualizar el método de pago por seguridad
  const venta = await Venta.findByIdAndUpdate(
    id,
    { metodoPago },
    { new: true },
  );

  res.json({
    mensaje: "El método de pago ha sido corregido",
    venta,
  });
};

// Solo para errores de carga inmediatos, ya que notas de credito serviran para horas o dias despues.
const anularVenta = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const venta = await Venta.findById(id);
    if (!venta || !venta.estado) {
      return res.json({
        mensaje: "La venta no existe o ya esta anulada",
      });
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
  } catch (error) {
    res.json({ mensaje: "Error al anular la venta." });
  }
};

module.exports = {
  ventasGet,
  ventaGetID,
  ventaPost,
  ventaPut,
  anularVenta,
};
