const { request, response } = require("express");
const Producto = require("../models/producto");
const AppError = require("../helpers/AppError");

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

  if (!producto) {
    throw new AppError("Producto no encontrado", 404);
  }

  res.json({
    mensaje: "Producto obtenido segun lo solicitado",
    producto,
  });
};

const productoPost = async (req = request, res = response) => {
  const { codigo, stock, stockCritico, precio, iva, ganancia, categoria } =
    req.body;
  const nombre = req.body.nombre.toUpperCase();

  const productoDB = await Producto.findOne({ nombre });
  if (productoDB) {
    throw new AppError(`El producto ${productoDB.nombre} ya existe.`, 409);
  }

  const factorIva = Number(iva) > 0 ? Number(iva) : 1;
  const factorGanancia = Number(ganancia) > 0 ? Number(ganancia) : 1;
  const costo = Number(precio) || 0;

  // Recalculamos el importe
  const importeCalculado = costo * factorIva * factorGanancia;

  const data = {
    codigo: codigo || "",
    nombre,
    // Asignamos 0 si vienen vacíos o no numéricos
    stock:
      stock !== "" && stock !== undefined && stock !== null
        ? Number(stock)
        : 0,
    stockCritico:
      stockCritico !== "" && stockCritico !== undefined && stockCritico !== null
        ? Number(stockCritico)
        : 0,
    precio,
    iva,
    ganancia,
    importe: Number(importeCalculado.toFixed(2)),
    categoria,
    usuario: req.usuario._id,
    fechaUltimoStock: new Date(),
    fechaUltimoPrecio: new Date(),
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

  const prodActual = await Producto.findById(id);

  if (!prodActual) {
    throw new AppError("No se encontro el producto para actualizar", 404);
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
};

const productoEstado = async (req = request, res = response) => {
  const { id } = req.params;

  const producto = await Producto.findById(id);

  if (!producto) {
    throw new AppError("Producto no encontrado", 404);
  }

  producto.estado = !producto.estado;
  await producto.save();

  res.json({
    mensaje: `El producto fue ${producto.estado ? "habilitado" : "deshabilitado"} correctamente`,
    producto,
  });
};

const productoDelete = async (req = request, res = response) => {
  const { id } = req.params;

  const productoBorrado = await Producto.findByIdAndDelete(id);

  if (!productoBorrado) {
    throw new AppError("El producto no existe o ya fue eliminado.", 404);
  }

  res.json({
    mensaje: "Producto eliminado definitivamente de la base de datos.",
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
