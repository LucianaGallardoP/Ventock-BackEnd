const { Schema, model } = require("mongoose");

const CategoriaSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique: true,
    trim: true,
    maxlength: [100, "El nombre no puede superar los 100 caracteres"],
  },
  estado: { type: Boolean, required: true, default: true },
  fechaRegistro: { type: Date, default: Date.now },
  usuario: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
});

module.exports = model("Categoria", CategoriaSchema);
