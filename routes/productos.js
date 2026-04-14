const { Router } = require("express");
const {
  productosGet,
  productoGetID,
  productoPost,
  productoPut,
  productoEstado,
  productoDelete,
} = require("../controllers/productos");
const { validarJWT } = require("../middlewares/validarJWT");
const { check } = require("express-validator");
const { productoExiste } = require("../helpers/db-validator");
const { validarCampos } = require("../middlewares/validarCampos");
const { esAdminRole } = require("../middlewares/validarRoles");

const router = Router();

router.get("/", [validarJWT], productosGet);

router.get(
  "/:id",
  [
    validarJWT,
    check("id", "El id no es valido").isMongoId(),
    check("id".custom(productoExiste)),
    validarCampos,
  ],
  productoGetID,
);

router.post(
  "/",
  [
    validarJWT,
    esAdminRole,
    check("nombre", "El nombre es obligatorio").notEmpty(),
    validarCampos,
  ],
  productoPost,
);

router.put(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "El id no es valido").isMongoId(),
    check("id").custom(productoExiste),
    validarCampos,
  ],
  productoPut,
);

router.patch(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "El id no es valido").isMongoId(),
    check("id").custom(productoExiste),
    validarCampos,
  ],
  productoEstado,
);

router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "El id no es valido").isMongoId(),
    check("id").custom(productoExiste),
    validarCampos,
  ],
  productoDelete,
);

module.exports = router;
