const { request, response } = require("express");
const Producto = require("../models/producto");

const productosGet = async (req = request, res = response) => {
  const { desde = 0, limite = 5 } = req.query;
  const query = { estado: true };

  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .skip(desde)
      .limit(limite)
      // .populate("usuario", "nombre"),
      .populate("categoria", "nombre"),
  ]);

  res.json({
    mensaje: "Productos obtenidos",
    total,
    productos,
  });
};

const productoGetID = async (req = request, res = response) => {
  const { id } = req.params;

  const producto = await Producto.findById(id)
    // .populate("usuario", "nombre"),
    .populate("categoria", "nombre");

  res.json({
    mensaje: "Producto obtenido segun lo solicitado",
    producto,
  });
};

const productoPost = async (req = request, res = response) => {
  const { stock, precio, iva, ganancia, categoria } = req.body;
  const nombre = req.body.nombre.toUpperCase();

  const productoDB = await Producto.findOne({ nombre });
  if (productoDB) {
    return res.json({
      mensaje: `El producto ${productoDB.nombre} ya existe.`,
    });
  }

  // Recalculamos el importe
  const importeCalculado = precio * (1 + ganancia / 100) * (1 + iva / 100);

  const data = {
    nombre,
    stock,
    precio,
    iva,
    ganancia,
    categoria,
    importe: importeCalculado.toFixed(2),
    // usuario: req.usuario._id
  };

  const producto = new Producto(data);
  await producto.save();

  res.json({
    mensaje: "Producto creado con exito.",
    producto,
  });
};

const productoPut = async (req = request, res = response) => {
  const { id } = req.params;
  const { _id, estado, usuario, ...data } = req.body;
  // const usuario = req.usuario._id;

  if (req.body.nombre) {
    data.nombre = req.body.nombre.toUpperCase();
  }

  if (data.precio || data.ganancia || data.iva) {
    const p = data.precio || 0;
    const g = Date.ganancia || 0;
    const i = data.iva || 0;
    data.importe = (p * (1 + g / 100) * (1 + i / 100)).toFixed(2);
  }

  // data.usuario = req.usuario._id;

  const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

  res.json({
    mensaje: "El producto se actualizo correctamente",
    producto,
  });
};

const productoEstado = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const producto = await Producto.findById(id);

    if (!producto) {
      return res.json({
        mensaje: "Producto no encontrado",
      });
    }

    producto.estado = !producto.estado;
    await producto.save();

    res.json({
      mensaje: `El producto fue ${producto.estado ? "habilitado" : "deshabilitado"} correctamente`,
    });
  } catch (error) {
    res.json({
      mensaje: "Error al procesar la solicitud",
    });
  }
};

const productoDelete = async (req = request, res = response) => {
  const { id } = req.params;

  const productoBorrado = await Producto.findByIdAndDelete(id);
  res.json({
    mensaje: "Producto eliminado correctamente.",
    productoBorrado,
  });
};

module.exports = {
  productosGet,
  productoGetID,
  productoPost,
  productoPut,
  productoEstado,
  productoDelete,
};
