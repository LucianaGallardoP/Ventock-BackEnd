const { response, request } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");

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

  // Guardar los datos en la BD
  await usuario.save();

  res.json({
    mensaje: "Usuario cargado correctamente en la BD",
    usuario,
  });
};

module.exports = {
  usuarioPost,
};
