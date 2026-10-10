const { request, response } = require("express");
const AppError = require("../helpers/AppError");
const { logError } = require("../helpers/logger");

const notFound = (req = request, res = response, next) => {
  next(new AppError(`Ruta no encontrada: ${req.originalUrl}`, 404));
};

const errorHandler = (err, req, res, next) => {
  logError(err, req);

  const statusCode = err.statusCode || 500;

  const mensaje = err.isOperational
    ? err.message
    : "Ocurrió un error inesperado. Por favor, intentá más tarde.";

  const body = { ok: false, mensaje };
  if (err.errores) {
    body.errores = err.errores;
  }

  res.status(statusCode).json(body);
};

module.exports = { notFound, errorHandler };
