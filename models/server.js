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
    // this.conectarDB();

    // Middlewares
    this.middlewares();

    // Funcion para rutas
    this.routes();
  }

  // async conectarDB() {
  //   await dbConnection();
  // }
  
  middlewares() {
    // 1. Interceptor de CORS y Preflight
    this.app.use((req, res, next) => {
      const allowedOrigins = [
        "https://ventock.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000"
      ];
      const origin = req.headers.origin;

      if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
      } else {
        res.setHeader("Access-Control-Allow-Origin", "https://ventock.vercel.app");
      }

      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, x-token, Authorization"
      );

      if (req.method === "OPTIONS") {
        return res.status(200).end();
      }

      next();
    });

    this.app.use(async (req, res, next) => {
      try {
        await dbConnection();
        next();
      } catch (error) {
        console.error("Error al conectar a la BD:", error);
        res.status(500).json({ msg: "Error de conexión en el servidor" });
      }
    });

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
    this.app.use(this.authPath, require("../routes/auth"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Server online in port: ", this.port);
    });
  }
}

module.exports = Server;
