const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  //   Si no hay token
  if (!token) {
    return res.status(400).json({
      mensaje: "No hay token en la peticion.",
    });
  }

  // Si si hay token
  try {
    // Verificar el token (que corresponda a nuestro sistema) y obtener el uid
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // Obtenemos los datos del usuario autenticado(uid)
    const usuario = await Usuario.findById(uid);

    // Validamos si existe
    if (!usuario) {
      return res.status(401).json({
        mensaje: "Token no valido - usuario no existe.",
      });
    }
    // Validamos si esta activo
    if (!usuario.estado) {
      return res.status(401).json({
        mensaje: "Token no valido - usuario inactivo.",
      });
    }

    req.usuario = usuario;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      mensaje: "Token no valido",
    });
  }
};

module.exports = {
  validarJWT,
};
