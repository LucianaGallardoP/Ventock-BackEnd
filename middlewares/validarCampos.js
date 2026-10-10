const { validationResult } = require("express-validator");
const AppError = require("../helpers/AppError");

const validarCampos = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const listaErrores = errors.array();
    const error = new AppError(listaErrores[0].msg, 400);
    error.errores = listaErrores;
    return next(error);
  }

  next();
};

module.exports = {
  validarCampos,
};
