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
const { productoExiste, categoriaExiste } = require("../helpers/db-validator");
const { validarCampos } = require("../middlewares/validarCampos");
const { esAdminRole } = require("../middlewares/validarRoles");

const router = Router();

router.get("/", [validarJWT], productosGet);

router.get(
  "/:id",
  [
    validarJWT,
    check("id", "El id no es valido").isMongoId(),
    check("id").custom(productoExiste),
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
    check("categoria", "La categoria es obligatoria").notEmpty(),
    check("categoria", "La categoria no es valida").isMongoId(),
    check("categoria").custom(categoriaExiste),
    check("codigo", "El codigo debe ser texto").optional().isString(),
    check("stock", "El stock debe ser un numero mayor o igual a 0")
      .optional()
      .isFloat({ min: 0 }),
    check(
      "stockCritico",
      "El stock critico debe ser un numero mayor o igual a 0",
    )
      .optional()
      .isFloat({ min: 0 }),
    check("precio", "El precio debe ser un numero mayor o igual a 0")
      .optional()
      .isFloat({ min: 0 }),
    check("iva", "El iva debe ser un numero mayor o igual a 0")
      .optional()
      .isFloat({ min: 0 }),
    check("ganancia", "La ganancia debe ser un numero mayor o igual a 0")
      .optional()
      .isFloat({ min: 0 }),
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
    check("nombre", "El nombre no puede estar vacio").optional().notEmpty(),
    check("categoria", "La categoria no es valida").optional().isMongoId(),
    check("categoria").optional().custom(categoriaExiste),
    check("codigo", "El codigo debe ser texto").optional().isString(),
    check("stock", "El stock debe ser un numero mayor o igual a 0")
      .optional()
      .isFloat({ min: 0 }),
    check(
      "stockCritico",
      "El stock critico debe ser un numero mayor o igual a 0",
    )
      .optional()
      .isFloat({ min: 0 }),
    check("precio", "El precio debe ser un numero mayor o igual a 0")
      .optional()
      .isFloat({ min: 0 }),
    check("iva", "El iva debe ser un numero mayor o igual a 0")
      .optional()
      .isFloat({ min: 0 }),
    check("ganancia", "La ganancia debe ser un numero mayor o igual a 0")
      .optional()
      .isFloat({ min: 0 }),
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
