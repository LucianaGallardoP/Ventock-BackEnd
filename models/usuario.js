const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
  nombre: { type: String, required: [true, "El nombre es obligatorio"] },
  apellido: { type: String, required: [true, "El apellido es obligatorio"] },
  correo: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
  },
  rol: {
    type: Schema.Types.ObjectId,
    ref: "Rol",
    required: [true, "El rol es obligatorio"],
  },
  fechaRegistro: { type: Date, default: Date.now },
  estado: { type: Boolean, default: true },
});

module.exports = model("Usuario", UsuarioSchema);
