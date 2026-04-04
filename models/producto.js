const { Schema, model } = require("mongoose");

const ProductoSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre del producto es obligatorio"],
    unique: true,
  },
  estado: { type: Boolean, require: true, default: true },
  stock: { type: Number, default: 0 },
  fechaRegistro: { type: Date, default: Date.now },
  precio: { type: Number, default: 0 },
  descuento: { type: Number, default: 0 },
  iva: { type: Number, default: 0 },
  importe: { type: Number, default: 0 },
  usuario: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  categoria: { type: Schema.Types.ObjectId, ref: "Categoria", required: true },
});

module.exports = model("Producto", ProductoSchema);
