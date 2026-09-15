const { request, response } = require("express");

const Venta = require("../models/venta");

const Producto = require("../models/producto");

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

  try {
    const venta = await Venta.findById(id)
      .populate("usuario", "nombre apellido")
      .populate("items.producto", "nombre");

    if (!venta) {
      return res.status(404).json({ mensaje: "Venta no encontrada" });
    }

    res.json({
      mensaje: "Venta obtenida con exito.",
      venta,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "El ID de la venta no es valido",
      error: error.message,
    });
  }
};

const ventaPost = async (req = request, res = response) => {
  const { items, total, metodoPago } = req.body;
  let stockDescontado = false;

  try {
    //Verificamos que los productos existan en la BD
    for (const item of items) {
      const productoDB = await Producto.findById(item.producto);

      if (!productoDB) {
        return res
          .status(404)
          .json({ mensaje: `El producto ${item.nombre} no existe` });
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
      usuario:req.usuario._id
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
        console.error(
          "Error al revertir el stock tras un fallo en la venta:",
          rollbackError,
        );
      }
    }

    res.status(500).json({
      mensaje: "Error al procesar la venta",
    });
  }
};

const ventaPut = async (req = request, res = response) => {
  const { id } = req.params;
  const { metodoPago } = req.body;

  try {
    // Solo permitimos actualizar el método de pago por seguridad
    const venta = await Venta.findByIdAndUpdate(
      id,
      { metodoPago },
      { new: true },
    );

    if (!venta) {
      return res.status(404).json({ mensaje: "Venta no encontrada" });
    }

    res.json({
      mensaje: "El método de pago ha sido corregido",
      venta,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar la venta." });
  }
};

// Solo para errores de carga inmediatos, ya que notas de credito serviran para horas o dias despues.
const anularVenta = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const venta = await Venta.findById(id);
    if (!venta) {
      return res.status(404).json({ mensaje: "La venta no existe" });
    }
    if (!venta.estado) {
      return res.status(409).json({ mensaje: "La venta ya esta anulada" });
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
    res.status(500).json({ mensaje: "Error al anular la venta." });
  }
};

module.exports = {
  ventasGet,
  ventaGetID,
  ventaPost,
  ventaPut,
  anularVenta,
};
