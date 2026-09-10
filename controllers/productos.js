const { request, response } = require("express");
const Producto = require("../models/producto");

const productosGet = async (req = request, res = response) => {
  const { desde = 0, limite = 20 } = req.query;
  const query = { estado: true };

  const [total, productos] = await Promise.all([

    Producto.countDocuments(query),
    Producto.find(query)
      .skip(desde)
      .limit(limite)
      .populate("usuario", "nombre")
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
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");

  res.json({
    mensaje: "Producto obtenido segun lo solicitado",
    producto,
  });
};

const productoPost = async (req = request, res = response) => {
  const {codigo, stock, stockCritico, precio, iva, ganancia, categoria } = req.body;
  const nombre = req.body.nombre.toUpperCase();

  const productoDB = await Producto.findOne({ nombre });
  if (productoDB) {
    return res.json({
      mensaje: `El producto ${productoDB.nombre} ya existe.`,
    });
  }

  const factorIva = Number(iva) > 0 ? Number(iva) : 1;
  const factorGanancia = Number(ganancia) > 0 ? Number(ganancia) : 1;
  const costo = Number(precio) || 0;

  // Recalculamos el importe
  const importeCalculado = costo * factorIva * factorGanancia;

  const data = {
    codigo: codigo || "",
    nombre,
    // stock,
    // stockCritico,
    // Asignamos 0 si vienen vacíos o no numéricos
    stock: stock !== "" && stock !== undefined && stock !== null ? Number(stock) : 0,
    stockCritico: stockCritico !== "" && stockCritico !== undefined && stockCritico !== null ? Number(stockCritico) : 0,
    precio,
    iva,
    ganancia,
    importe: Number(importeCalculado.toFixed(2)),
    categoria,
    usuario: req.usuario._id,
    fechaUltimoStock: new Date(),
    fechaUltimoPrecio: new Date()
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


  try {
    const prodActual = await Producto.findById(id);

    if (!prodActual) {
      return res.status(404).json({
        mensaje: "No se encontro el producto para actualizar",
      });
    }

    if (data.stock !== undefined && Number(data.stock) !== prodActual.stock) {
      data.fechaUltimoStock = new Date();
    }

    if (req.body.nombre) {
      data.nombre = req.body.nombre.toUpperCase();
    }

    if (
      data.precio !== undefined ||
      data.ganancia !== undefined ||
      data.iva !== undefined
    ) {
      // const p = data.precio ?? prodActual.precio;
      // const g = data.ganancia ?? prodActual.ganancia;
      // const i = data.iva ?? prodActual.iva;
      // data.importe = Number((p * (1 + g / 100) * (1 + i / 100)).toFixed(2));
    
    const p = Number(data.precio ?? prodActual.precio) || 0;
      const g = Number(data.ganancia ?? prodActual.ganancia) || 1;
      const i = Number(data.iva ?? prodActual.iva) || 1;
      
      data.importe = Number((p * g * i).toFixed(2));
      data.fechaUltimoPrecio = new Date();
    }
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json({
      mensaje: "El producto se actualizo correctamente",
      producto,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al actualizar el producto.",
      error,
    });
  }
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
  try {
    const productoBorrado = await Producto.findByIdAndDelete(id);

    if (!productoBorrado) {
      return res.status(404).json({
        mensaje: "El producto no existe o ya fue eliminado.",
      });
    }

    res.json({
      mensaje: "Producto eliminado definitivamente de la base de datos.",
      productoBorrado,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar el producto de la base de datos.",
      error,
    });
  }
};

module.exports = {
  productosGet,
  productoGetID,
  productoPost,
  productoPut,
  productoEstado,
  productoDelete,
};
