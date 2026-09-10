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

  // middlewares() {
  //   // CORS
  //   this.app.use(
  //     cors({
  //       origin: [
  //         "https://ventock.vercel.app",
  //         "http://localhost:5173",   // Entorno de desarrollo local
  //       ],

  //       methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  //       allowedHeaders: ["Content-Type", "x-token"],
  //       credentials: true,
  //     })
  //   );
  middlewares() {
    const corsOptions = {
      origin: function (origin, callback) {
        const allowedOrigins = [
          "https://ventock.vercel.app",
          "http://localhost:5173",
          "http://localhost:3001",
        ];

        if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.endsWith(".vercel.app")) {
          callback(null, true);
        } else {
          callback(new Error("No permitido por CORS"));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "x-token", "Authorization"],
      credentials: true,
    };

    this.app.use(cors(corsOptions));

    this.app.options("*", cors(corsOptions));

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
