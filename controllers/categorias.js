const { request, response } = require("express");

const Categoria = require("../models/categoria");
const AppError = require("../helpers/AppError");
const { textoRequerido } = require("../helpers/sanitize");

const categoriasGet = async (req = request, res = response) => {
  const { desde = 0, limite = 10, todas } = req.query;
  const query = todas === "true" ? {} : { estado: true };

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
      .skip(desde)
      .limit(limite)
      .populate("usuario", "correo"),
  ]);

  res.json({
    mensaje: "Categorias obtenidas",
    total,
    categorias,
  });
};

const categoriaGetID = async (req = request, res = response) => {
  const { id } = req.params;

  const categoria = await Categoria.findById(id).populate(
    "usuario",
    "nombre apellido correo",
  );

  if (!categoria) {
    throw new AppError("Categoria no encontrada", 404);
  }

  res.json({
    mensaje: "Categoria obtenida segun el pedido del usuario",
    categoria,
  });
};

const categoriaPost = async (req = request, res = response) => {
  const nombre = textoRequerido(
    req.body.nombre,
    "El nombre de la categoria",
  ).toUpperCase();

  // Verificamos si la cat existe
  const categoriaDB = await Categoria.findOne({ nombre });

  if (categoriaDB) {
    throw new AppError(`La categoria ${categoriaDB.nombre} ya existe`, 409);
  }

  //   Data a guarda en la DB
  const data = {
    nombre,
    usuario: req.usuario._id,
  };

  const categoria = new Categoria(data);

  //   Guardamos en DB
  await categoria.save();

  res.json({
    mensaje: `La Categoria ${categoria.nombre} fue creada correctamente.`,
    categoria,
  });
};

const categoriaPut = async (req = request, res = response) => {
  const { id } = req.params;
  const nombre = textoRequerido(
    req.body.nombre,
    "El nombre de la categoria",
  ).toUpperCase();
  const usuario = req.usuario._id;

  const data = { nombre, usuario };
  const categoria = await Categoria.findByIdAndUpdate(id, data, {
    new: true,
  });

  if (!categoria) {
    throw new AppError("Categoria no encontrada", 404);
  }

  res.json({
    mensaje: `Categoria actualizada correctamente`,
    categoria,
  });
};

const categoriaEstado = async (req = request, res = response) => {
  const { id } = req.params;

  const categoria = await Categoria.findById(id);

  if (!categoria) {
    throw new AppError("Categoria no encontrada", 404);
  }

  categoria.estado = !categoria.estado;
  await categoria.save();

  res.json({
    mensaje: `La categoria fue ${categoria.estado ? "habilitada" : "deshabilitada"} correctamente`,
    categoria,
  });
};

const categoriaDelete = async (req = request, res = response) => {
  const { id } = req.params;

  const categoriaBorrada = await Categoria.findByIdAndDelete(id);

  if (!categoriaBorrada) {
    throw new AppError("Categoria no encontrada", 404);
  }

  res.json({
    mensaje: `Categoria eliminada correctamente`,
    categoriaBorrada,
  });
};

module.exports = {
  categoriasGet,
  categoriaGetID,
  categoriaPost,
  categoriaPut,
  categoriaEstado,
  categoriaDelete,
};
