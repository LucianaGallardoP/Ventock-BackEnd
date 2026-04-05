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

module.exports = {
  usuariosGet,
  usuarioGetID,
  usuarioPost,
};
