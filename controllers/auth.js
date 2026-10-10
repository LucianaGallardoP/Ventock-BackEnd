const { request, response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generarJWT");
const AppError = require("../helpers/AppError");

const login = async (req = request, res = response) => {
  const { correo, password } = req.body;

  const usuario = await Usuario.findOne({ correo });

  //Verificamos si el correo existe
  if (!usuario) {
    throw new AppError(
      "Correo o password incorrectos | usuario inexistente.",
      400,
    );
  }

  // Verificamos si el usuario esta activo
  if (!usuario.estado) {
    throw new AppError(
      "Correo o password incorrectos | usuario inactivo.",
      400,
    );
  }

  // Verificamos el password
  const validarPassword = bcrypt.compareSync(password, usuario.password);
  if (!validarPassword) {
    throw new AppError(
      "Correo o password incorrectos | password erroneo.",
      400,
    );
  }

  // Generamos el token
  const token = await generarJWT(usuario.id);
  res.json({
    mensaje: "Usuario logueado con exito",
    usuario,
    token,
  });
};

module.exports = {
  login,
};
