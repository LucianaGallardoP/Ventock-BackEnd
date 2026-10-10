const VARIABLES_REQUERIDAS = ["SECRETORPRIVATEKEY", "MONGODB_CNN"];

const validarVariablesDeEntorno = () => {
  const faltantes = VARIABLES_REQUERIDAS.filter(
    (nombre) => !process.env[nombre] || process.env[nombre].trim() === "",
  );

  if (faltantes.length > 0) {
    console.error(
      `[FATAL] Faltan variables de entorno obligatorias: ${faltantes.join(", ")}. ` +
        "Revisá el archivo .env (o la configuración de variables de entorno " +
        "del hosting) antes de volver a iniciar el servidor.",
    );
    process.exit(1);
  }
};

module.exports = { validarVariablesDeEntorno };
