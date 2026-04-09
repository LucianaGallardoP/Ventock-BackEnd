const { Schema, model } = require("mongoose");

const ProductoSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre del producto es obligatorio"],
    unique: true,
  },
  stock: { type: Number, default: 0 },
  precio: { type: Number, default: 0 },
  iva: { type: Number, default: 0 },
  ganancia: { type: Number, default: 0 },
  importe: { type: Number, required:true },
  categoria: { type: Schema.Types.ObjectId, ref: "Categoria", required: true },
  // usuario: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  estado: { type: Boolean, require: true, default: true },
  fechaRegistro: { type: Date, default: Date.now },
});

module.exports = model("Producto", ProductoSchema);
