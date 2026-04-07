const { request, response } = require("express");

const Categoria = require("../models/categoria");

const categoriasGet = async (req = request, res = response) => {
  const { desde = 0, limite = 5 } = req.query;
  const query = { estado: true };

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query).skip(desde).limit(limite),
    // .populate("Usuario", "correo"),
  ]);

  res.json({
    mensaje: "Categorias obtenidas",
    total,
    categorias,
  });
};

const categoriaGetID = async (req = request, res = response) => {
  const { id } = req.params;
  const categoria = await Categoria.findById(id);
  //   .populate("Usuario", "nombre apellido correo",);

  res.json({
    mensaje: "Categoria obtenida segun el pedido del usuario",
    categoria,
  });
};

const categoriaPost = async (req = request, res = response) => {
  const nombre = req.body.nombre.toUpperCase();

  // Verificamos si la cat existe
  const categoriaDB = await Categoria.findOne({ nombre });

  if (categoriaDB) {
    res.json({
      mensaje: `La categoria ${categoriaDB.nombre} ya existe`,
    });
  }

  //   Data a guarda en la DB
  const data = {
    nombre,
    // usuario: req.usuario._id,
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
  const nombre = req.body.nombre.toUpperCase();
  // const usuario = req.usuario._id

  const data = { nombre /*, usuario*/ };
  const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

  res.json({
    mensaje: `Categoria actualizada correctamente`,
    categoria,
  });
};

const categoriaInhabilitada = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const categoriaDeshabilitada = await Categoria.findByIdAndUpdate(
      id,
      { estado: false },
      { new: true },
    );

    res.json({
      mensaje: `La categoria ${categoriaDeshabilitada.nombre} ha sido deshabilitada correctamente`,
      categoriaDeshabilitada,
    });
  } catch (error) {
    res.json({
      mensaje: "Error al procesar la solicitud de deshabilitacion.",
    });
  }
};

const categoriaDelete = async (req = request, res = response) => {
  const { id } = req.params;
  const categoriaBorrada = await Categoria.findByIdAndDelete(id);

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
  categoriaInhabilitada,
  categoriaDelete,
};
