const { request, response } = require("express");
const AppError = require("../helpers/AppError");

const esSuperAdminRole = (req = request, res = response, next) => {
  if (!req.usuario) {
    return next(
      new AppError("Se quiere validar el rol sin validar el token", 500),
    );
  }

  const { rol, nombre, apellido } = req.usuario;

  if (rol !== "SuperAdmin") {
    return next(
      new AppError(
        `${nombre} ${apellido} no es SuperAdmin, no tiene permiso para esta accion.`,
        403,
      ),
    );
  }
  next();
};

const esAdminRole = (req = request, res = response, next) => {
  if (!req.usuario) {
    return next(
      new AppError("Se quiere validar el rol sin validar el token", 500),
    );
  }

  const { rol, nombre, apellido } = req.usuario;

  if (rol !== "Admin" && rol !== "SuperAdmin") {
    return next(
      new AppError(
        `${nombre} ${apellido} no es Administrador del sistema, no tiene permiso para esta accion.`,
        403,
      ),
    );
  }
  next();
};

const esVendedorRole = (...roles) => {
  return (req = request, res = response, next) => {
    if (!req.usuario) {
      return next(
        new AppError("Se quiere validar el rol sin validar el token.", 500),
      );
    }

    if (!roles.includes(req.usuario.rol)) {
      return next(
        new AppError(`El servicio requiere uno de estos roles: ${roles}`, 403),
      );
    }
    next();
  };
};

module.exports = {
  esSuperAdminRole,
  esAdminRole,
  esVendedorRole,
};
