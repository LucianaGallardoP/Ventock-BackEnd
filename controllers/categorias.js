const { request, response } = require("express");

const Categoria = require("../models/categoria");

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

  try {
    const categoria = await Categoria.findById(id).populate(
      "usuario",
      "nombre apellido correo",
    );

    if (!categoria) {
      return res.status(404).json({ mensaje: "Categoria no encontrada" });
    }

    res.json({
      mensaje: "Categoria obtenida segun el pedido del usuario",
      categoria,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener la categoria." });
  }
};

const categoriaPost = async (req = request, res = response) => {
  try {
    const nombre = req.body.nombre.toUpperCase();

    // Verificamos si la cat existe
    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
      return res.status(409).json({
        mensaje: `La categoria ${categoriaDB.nombre} ya existe`,
      });
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
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear la categoria." });
  }
};

const categoriaPut = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const nombre = req.body.nombre.toUpperCase();
    const usuario = req.usuario._id;

    const data = { nombre, usuario };
    const categoria = await Categoria.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!categoria) {
      return res.status(404).json({ mensaje: "Categoria no encontrada" });
    }

    res.json({
      mensaje: `Categoria actualizada correctamente`,
      categoria,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar la categoria." });
  }
};

const categoriaEstado = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const categoria = await Categoria.findById(id);

    if (!categoria) {
      return res.status(404).json({
        mensaje: "Categoria no encontrada",
      });
    }

    categoria.estado = !categoria.estado;
    await categoria.save();

    res.json({
      mensaje: `La categoria fue ${categoria.estado ? "habilitada" : "deshabilitada"} correctamente`,
      categoria,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al procesar la solicitud.",
    });
  }
};

const categoriaDelete = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const categoriaBorrada = await Categoria.findByIdAndDelete(id);

    if (!categoriaBorrada) {
      return res.status(404).json({ mensaje: "Categoria no encontrada" });
    }

    res.json({
      mensaje: `Categoria eliminada correctamente`,
      categoriaBorrada,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar la categoria." });
  }
};

module.exports = {
  categoriasGet,
  categoriaGetID,
  categoriaPost,
  categoriaPut,
  categoriaEstado,
  categoriaDelete,
};
