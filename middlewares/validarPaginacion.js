const { check } = require("express-validator");

const validarPaginacion = [
  check("desde", "desde debe ser un numero entero mayor o igual a 0")
    .optional()
    .isInt({ min: 0 }),
  check("limite", "limite debe ser un numero entero entre 1 y 100")
    .optional()
    .isInt({ min: 1, max: 100 }),
];

module.exports = { validarPaginacion };
