const logError = (err, req) => {
  const timestamp = new Date().toISOString();
  const contexto = req ? `${req.method} ${req.originalUrl}` : "sin contexto de request";
  const statusCode = err.statusCode || 500;

  console.error(`[${timestamp}] [${statusCode}] ${contexto} - ${err.message}`);
  if (!err.isOperational) {
    console.error(err.stack);
  }
};

module.exports = { logError };
