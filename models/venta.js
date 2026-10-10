const { Schema, model } = require("mongoose");

const VentaSchema = Schema({
  // El carrito vive aqui dentro como un array
  items: [
    {
      producto: {
        type: Schema.Types.ObjectId,
        ref: "Producto",
        required: true,
      },
      nombre: { type: String, trim: true },
      cantidad: {
        type: Number,
        required: true,
        min: [0.01, "La cantidad debe ser mayor a 0"],
      },
      importe: { type: Number, required: true, min: 0 },
      subtotal: { type: Number, required: true, min: 0 },
    },
  ],
  total: {
    type: Number,
    required: [true, "El total de la venta es obligatorio"],
    min: [0, "El total no puede ser negativo"],
  },
  metodoPago: {
    type: String,
    required: [true, "El metodo de pago es obligatorio"],
    enum: ["Efectivo", "Transferencia", "Debito", "Credito"],
  },
  usuario: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  fechaRegistro: { type: Date, default: Date.now },
  estado: { type: Boolean, default: true },
});

module.exports = model("Venta", VentaSchema);
