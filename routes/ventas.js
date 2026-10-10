const { Router } = require("express");

const {
  ventasGet,
  ventaGetID,
  ventaPost,
  ventaPut,
  anularVenta,
} = require("../controllers/ventas");
const { validarJWT } = require("../middlewares/validarJWT");
const { esAdminRole } = require("../middlewares/validarRoles");
const { validarCampos } = require("../middlewares/validarCampos");
const { check } = require("express-validator");
const { ventaExiste, categoriaExiste } = require("../helpers/db-validator");

const router = Router();

router.get("/", [validarJWT], ventasGet);

router.get(
  "/:id",
  [
    validarJWT,
    check("id", "El id no es valido").isMongoId().bail().custom(ventaExiste),
    validarCampos,
  ],
  ventaGetID,
);

const METODOS_PAGO = ["Efectivo", "Transferencia", "Debito", "Credito"];

router.post(
  "/",
  [
    validarJWT,
    check("total", "El total de la venta es obligatorio")
      .notEmpty()
      .isFloat({ min: 0 }),
    check("metodoPago", `El metodo de pago debe ser uno de: ${METODOS_PAGO}`)
      .notEmpty()
      .isIn(METODOS_PAGO),
    check("items", "La venta debe tener al menos un producto").isArray({
      min: 1,
    }),
    check("items.*.producto", "El id del producto no es valido").isMongoId(),
    check(
      "items.*.cantidad",
      "La cantidad de cada producto debe ser mayor a 0",
    ).isFloat({ gt: 0 }),
    check(
      "items.*.importe",
      "El importe de cada producto debe ser un numero valido",
    ).isFloat({ min: 0 }),
    check(
      "items.*.subtotal",
      "El subtotal de cada producto debe ser un numero valido",
    ).isFloat({ min: 0 }),
    validarCampos,
  ],
  ventaPost,
);

router.put(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "El id no es valido").isMongoId().bail().custom(ventaExiste),
    check("metodoPago", `El metodo de pago debe ser uno de: ${METODOS_PAGO}`)
      .notEmpty()
      .isIn(METODOS_PAGO),
    validarCampos,
  ],
  ventaPut,
);

router.patch(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "El id no es valido").isMongoId().bail().custom(ventaExiste),
    validarCampos,
  ],
  anularVenta,
);

module.exports = router;
