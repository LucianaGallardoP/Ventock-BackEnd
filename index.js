const Server = require("./models/server");

require("dotenv").config();

const { validarVariablesDeEntorno } = require("./helpers/validarEnv");
validarVariablesDeEntorno();

const server = new Server();

if (process.env.NODE_ENV !== "production") {
  server.listen();
}
// server.listen();

module.exports = server.app
