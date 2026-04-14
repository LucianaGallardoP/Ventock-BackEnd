const jwt = require("jsonwebtoken");

const generarJWT = (uid) => {
  return new Promise((resolve, reject) => {
    // Dato que queremos que se tokenice
    const payload = { uid };

    // Generamos JWT
    jwt.sign(
      payload,
      process.env.SECRETORPRIVATEKEY,
      { expiresIn: "12h" },
      (error, token) => {
        if (error) {
          console.log(error);
          reject("No se puede generar el token");
        } else {
          resolve(token);
        }
      },
    );
  });
};

module.exports = { generarJWT };
