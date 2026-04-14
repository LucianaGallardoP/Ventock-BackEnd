const { request, response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req = request, res = response) => {
  const { correo, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo });

    //Verificamos si el correo existe
    if (!usuario) {
      return res.status(500).json({
        mensaje: "Correo o password incorrectos | usuario inexistente.",
      });
    }

    // Verificamos si el usuario esta activo
    if (!usuario.estado) {
      return res.status(400).json({
        mensaje: "Correo o password incorrectos | usuario inactivo.",
      });
    }

    // Verificamos el password
    const validarPassword = bcrypt.compareSync(password, usuario.password);
    if (!validarPassword) {
      return res.status(400).json({
        mensaje: "Correo o password incorrectos | password erroneo.",
      });
    }

    // Generamos el token
    const token = await generarJWT(usuario.id);
    res.json({
      mensaje: "Usuario logueado con exito",
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      mensaje: "Hable con el administrador del sistema",
    });
  }
};

module.exports = {
  login,
};
