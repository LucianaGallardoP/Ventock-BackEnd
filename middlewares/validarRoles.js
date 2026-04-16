const { request, response } = require("express");

const esSuperAdminRole = (req = request, res = response, next) => {
  if (!req.usuario) {
    return res.json({
      mensaje: "Se quiere validar el rol sin validar el token",
    });
  }

  const { rol, nombre, apellido } = req.usuario;

  if (rol !== "SuperAdmin") {
    return res.status(401).json({
      mensaje: `${nombre} ${apellido} no es SuperAdmin, no tiene permiso para esta accion.`,
    });
  }
  next();
};

const esAdminRole = (req = request, res = response, next) => {
  if (!req.usuario) {
    return res.json({
      mensaje: "Se quiere validar el rol sin validar el token",
    });
  }

  const { rol, nombre, apellido } = req.usuario;

  if (rol !== "Admin" && rol !== "SuperAdmin") {
    return res.status(401).json({
      mensaje: `${nombre} ${apellido} no es Administrador del sistema, no tiene permiso para esta accion.`,
    });
  }
  next();
};

const esVendedorRole = (...roles) => {
  return (req = request, res = response, next) => {
    if (!req.usuario) {
      return res.json({
        mensaje: "Se quiere validar el rol sin validar el token.",
      });
    }

    if (!roles.includes(req.usuario.rol)) {
      return res.status(400).json({
        mensaje: `El servicio requiere uno de esots roles: ${roles}`,
      });
    }
    next();
  };
};

module.exports = {
  esSuperAdminRole,
  esAdminRole,
  esVendedorRole,
};
