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
      nombre: { type: String },
      cantidad: { type: Number, required: true },
      precioUnitario: { type: Number, required: true },
      subtotal: { type: Number, required: true },
    },
  ],
  total: {
    type: Number,
    required: [true, "El total de la venta es obligatorio"],
  },
  metodoPago: {
    type: String,
    required: [true, "El metodo de pago es obligatorio"],
    enum: ["Efectivo", "Transferencia", "Debito", "Credito"],
  },
  // usuario: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  fechaRegistro: { type: Date, default: Date.now },
  estado: { type: Boolean, default: true },
});

module.exports = model("Venta", VentaSchema);
