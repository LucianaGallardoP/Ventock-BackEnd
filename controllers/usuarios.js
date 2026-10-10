const { response, request } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");
const AppError = require("../helpers/AppError");

const usuariosGet = async (req = request, res = response) => {
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

  const usuario = await Usuario.findById(id);

  if (!usuario) {
    throw new AppError("Usuario no encontrado", 404);
  }

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
  usuario.password = undefined;

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

  if (!usuario) {
    throw new AppError("Usuario no encontrado", 404);
  }

  res.json({
    mensaje: "Usuario actualizado correctamente",
    usuario,
  });
};

const usuarioEstado = async (req = request, res = response) => {
  const { id } = req.params;

  const usuario = await Usuario.findById(id);

  if (!usuario) {
    throw new AppError("Usuario no encontrado", 404);
  }

  usuario.estado = !usuario.estado;
  await usuario.save();

  res.json({
    mensaje: `El usuario fue ${usuario.estado ? "habilitado" : "deshabilitado"} correctamente`,
    usuario,
  });
};

const usuarioDelete = async (req = request, res = response) => {
  const { id } = req.params;

  const usuarioBorrado = await Usuario.findByIdAndDelete(id);

  if (!usuarioBorrado) {
    throw new AppError("Usuario no encontrado", 404);
  }

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
  usuarioEstado,
  usuarioDelete,
};
