const { Schema, model } = require("mongoose");

const DetalleVentaSchema = Schema({
  venta: { type: Schema.Types.ObjectId, ref: "Venta", required: true },
  producto: { type: Schema.Types.ObjectId, ref: "Producto", required: true },
  cantidad: {
    type: Number,
    required: [true, "La cantidad es obligatoria"],
    min: [1, "La cantidad minima debe ser 1"],
  },
  precioUnitario: { type: Number, required: true },
  subtotal: { type: Number, required: true },
});

module.exports = model("DetalleVenta", DetalleVentaSchema);
