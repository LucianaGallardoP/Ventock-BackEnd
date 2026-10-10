const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");
const AppError = require("../helpers/AppError");

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  //   Si no hay token
  if (!token) {
    return next(new AppError("No hay token en la peticion.", 400));
  }

  // Si si hay token
  try {
    // Verificar el token (que corresponda a nuestro sistema) y obtener el uid
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // Obtenemos los datos del usuario autenticado(uid)
    const usuario = await Usuario.findById(uid);

    // Validamos si existe
    if (!usuario) {
      return next(new AppError("Token no valido - usuario no existe.", 401));
    }
    // Validamos si esta activo
    if (!usuario.estado) {
      return next(new AppError("Token no valido - usuario inactivo.", 401));
    }

    req.usuario = usuario;

    next();
  } catch (error) {
    next(new AppError("Token no valido", 401));
  }
};

module.exports = {
  validarJWT,
};
