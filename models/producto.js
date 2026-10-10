const { Schema, model } = require("mongoose");

const ProductoSchema = Schema({
  codigo: { type: String, default: "", trim: true, maxlength: 50 },
  nombre: {
    type: String,
    required: [true, "El nombre del producto es obligatorio"],
    unique: true,
    trim: true,
    maxlength: [150, "El nombre no puede superar los 150 caracteres"],
  },
  stock: { type: Number, default: 0, min: [0, "El stock no puede ser negativo"] },
  fechaUltimoStock: { type: Date, default: Date.now },
  fechaUltimoPrecio: { type: Date, default: Date.now },
  stockCritico: {
    type: Number,
    default: 0,
    min: [0, "El stock critico no puede ser negativo"],
  },
  precio: { type: Number, default: 0, min: [0, "El precio no puede ser negativo"] },
  ganancia: { type: Number, default: 1, min: [0, "La ganancia no puede ser negativa"] },
  iva: { type: Number, default: 1, min: [0, "El iva no puede ser negativo"] },
  importe: { type: Number, required: true, min: [0, "El importe no puede ser negativo"] },
  categoria: { type: Schema.Types.ObjectId, ref: "Categoria", required: true },
  usuario: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  estado: { type: Boolean, require: true, default: true },
  fechaRegistro: { type: Date, default: Date.now },
});

ProductoSchema.pre("save", function () {
  if (this.isModified("stock")) {
    this.fechaUltimoStock = Date.now();
  }
});

module.exports = model("Producto", ProductoSchema);
