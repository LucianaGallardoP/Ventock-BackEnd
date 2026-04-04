const { Schema, model } = require("mongoose");

const VentaSchema = Schema({
  total: {
    type: Number,
    required: [true, "El total de la venta es obligatorio"],
  },
  fechaRegistro: { type: Date, default: Date.now },
  usuario: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  estado: { type: Boolean, default: true },
  metodoPago: {
    type: String,
    required: [true, "El metodo de pago es obligatorio"],
  },
  enum: ["Efectivo", "Transferencia", "Debito", "Credito"],
});

module.exports = model("Venta", VentaSchema);
