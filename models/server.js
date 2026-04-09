const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3001;
    this.authPath = "/api/auth";
    this.usuariosPath = "/api/usuarios";
    this.categoriasPath = "/api/categorias";
    this.productosPath = "/api/productos";
    this.ventasPath = "/api/ventas";

    // Conectar con BD
    this.conectarDB();

    // Middlewares
    this.middlewares();

    // Funcion para rutas
    this.routes();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    // CORS
    this.app.use(cors());
    // Leer lo que el usuario envia desde el front end
    this.app.use(express.json());
    // Definir una carpeta public
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.usuariosPath, require("../routes/usuarios"));
    this.app.use(this.categoriasPath, require("../routes/categorias"));
    this.app.use(this.productosPath, require("../routes/productos"));
    this.app.use(this.ventasPath, require("../routes/ventas"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Server online in port: ", this.port);
    });
  }
}

module.exports = Server;
