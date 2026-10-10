const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    trim: true,
    maxlength: 100,
  },
  apellido: {
    type: String,
    required: [true, "El apellido es obligatorio"],
    trim: true,
    maxlength: 100,
  },
  correo: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
    select: false,
  },
  rol: {
    type: String,
    required: [true, "El rol es obligatorio"],
  },
  fechaRegistro: { type: Date, default: Date.now },
  estado: { type: Boolean, default: true },
});

module.exports = model("Usuario", UsuarioSchema);
