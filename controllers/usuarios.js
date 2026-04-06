const { response, request } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");

const usuariosGet = async (req = request, res = response) => {
  const { desde = 0, limite = 5 } = req.query;
  const query = { estado: true };

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

  const usuario = await Usuario.findById(id);

  res.json({
    mensaje: "Usuario obtenido",
    usuario,
  });
};

const usuarioPost = async (req = request, res = response) => {
  // Recibir el cuerpo de la peticion
  const datos = req.body;

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
};

const usuarioPut = async (req = request, res = response) => {
  const { id } = req.params;

  const { password, correo, ...resto } = req.body;

  // Si actualiza el password, lo encriptamos
  if (password) {
    const salt = bcrypt.genSaltSync(10);
    resto.password = bcrypt.hashSync(password, salt);
  }

  resto.correo = correo;

  const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true });

  res.json({
    mensaje: "Usuario actualizado correctamente",
    usuario,
  });
};

const usuarioInhabilitado = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const usuarioDeshabilitado = await Usuario.findByIdAndUpdate(
      id,
      { estado: false },
      { new: true },
    );

    res.json({
      mensaje: "El usuario ha sido deshabilitado correctamente",
      usuarioDeshabilitado,
    });
  } catch (error) {
    res.json({
      mensaje: "Error al procesar la solicitud de deshabilitacion",
    });
  }
};

const usuarioDelete = async (req = request, res = response) => {
  const { id } = req.params;

  const usuarioBorrado = await Usuario.findByIdAndDelete(id);

  res.json({
    mensaje: "Usuario eliminado correctamente.",
    usuarioBorrado,
  });
};

module.exports = {
  usuariosGet,
  usuarioGetID,
  usuarioPost,
  usuarioPut,
  usuarioInhabilitado,
  usuarioDelete
};
