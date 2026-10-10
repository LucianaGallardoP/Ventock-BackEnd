const AppError = require("./AppError");
const textoRequerido = (valor, nombreCampo = "El campo") => {
  if (typeof valor !== "string" || valor.trim() === "") {
    throw new AppError(`${nombreCampo} es obligatorio y debe ser texto.`, 400);
  }
  return valor.trim();
};

module.exports = { textoRequerido };
