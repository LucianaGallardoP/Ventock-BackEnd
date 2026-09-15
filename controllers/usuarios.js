const { response, request } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");

const usuariosGet = async (req = request, res = response) => {
  // const { desde = 0, limite = 10 } = req.query;
  const desde = parseInt(req.query.desde, 10) || 0;
  const limite = parseInt(req.query.limite, 10) || 10;
  const query = {};

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(desde).limit(limite),
  ]);

  res.json({
    mensaje: "Usuarios obtenidos",
    total,
    usuarios,
  });
};

const usuarioGetID = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json({
      mensaje: "Usuario obtenido",
      usuario,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el usuario." });
  }
};

const usuarioPost = async (req = request, res = response) => {
  // Recibir el cuerpo de la peticion
  const datos = req.body;

  try {
    const { nombre, apellido, correo, password, rol } = datos;
    const usuario = new Usuario({
      nombre,
      apellido,
      correo,
      password,
      rol,
    });

    //   Encriptar la contraseña
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    usuario.password = hash;

    // Guardar los datos en la BD
    await usuario.save();

    res.json({
      mensaje: "Usuario cargado correctamente en la BD",
      usuario,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear el usuario." });
  }
};

const usuarioPut = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const { password, correo, ...resto } = req.body;

    // Si actualiza el password, lo encriptamos
    if (password) {
      const salt = bcrypt.genSaltSync(10);
      resto.password = bcrypt.hashSync(password, salt);
    }

    resto.correo = correo;

    const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true });

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json({
      mensaje: "Usuario actualizado correctamente",
      usuario,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar el usuario." });
  }
};

const usuarioEstado = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    usuario.estado = !usuario.estado;
    await usuario.save();

    res.json({
      mensaje: `El usuario fue ${usuario.estado ? "habilitado" : "deshabilitado"} correctamente`,
      usuario,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al procesar la solicitud",
    });
  }
};

const usuarioDelete = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const usuarioBorrado = await Usuario.findByIdAndDelete(id);

    if (!usuarioBorrado) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json({
      mensaje: "Usuario eliminado correctamente.",
      usuarioBorrado,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el usuario." });
  }
};

module.exports = {
  usuariosGet,
  usuarioGetID,
  usuarioPost,
  usuarioPut,
  usuarioEstado,
  usuarioDelete,
};
