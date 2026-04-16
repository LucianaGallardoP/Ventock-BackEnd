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
    check("id", "El id no es valido").isMongoId(),
    check("id").custom(ventaExiste),
    validarCampos,
  ],
  ventaGetID,
);

router.post(
  "/",
  [
    validarJWT,
    check("total", "El total de la venta es obligatorio").notEmpty(),
    check("metodoPago", "El metodo de pago es obligatorio").notEmpty(),
    validarCampos,
  ],
  ventaPost,
);

router.put(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "El id no es valido").isMongoId(),
    check("id").custom(ventaExiste),
    validarCampos,
  ],
  ventaPut,
);

router.patch(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "El id no es valido").isMongoId(),
    check("id").custom(ventaExiste),
    validarCampos,
  ],
  anularVenta,
);

module.exports = router;
