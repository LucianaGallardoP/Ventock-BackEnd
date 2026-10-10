const { Router } = require("express");

const {
  categoriasGet,
  categoriaGetID,
  categoriaPost,
  categoriaPut,
  categoriaEstado,
  categoriaDelete,
} = require("../controllers/categorias");
const { validarJWT } = require("../middlewares/validarJWT");
const { check } = require("express-validator");
const { categoriaExiste } = require("../helpers/db-validator");
const { validarCampos } = require("../middlewares/validarCampos");
const { esAdminRole } = require("../middlewares/validarRoles");
const { validarPaginacion } = require("../middlewares/validarPaginacion");

const router = Router();

router.get(
  "/",
  [validarJWT, ...validarPaginacion, validarCampos],
  categoriasGet,
);

router.get(
  "/:id",
  [
    validarJWT,
    check("id", "El id no es valido").isMongoId().bail().custom(categoriaExiste),
    validarCampos,
  ],
  categoriaGetID,
);

router.post(
  "/",
  [
    validarJWT,
    esAdminRole,
    check("nombre", "El nombre de la categoria es obligatorio")
      .isString()
      .trim()
      .notEmpty(),
    validarCampos,
  ],
  categoriaPost,
);

router.put(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "El id no es valido").isMongoId().bail().custom(categoriaExiste),
    check("nombre", "El nombre de la categoria es obligatorio")
      .isString()
      .trim()
      .notEmpty(),
    validarCampos,
  ],
  categoriaPut,
);

router.patch(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "El id no es valido").isMongoId().bail().custom(categoriaExiste),
    validarCampos,
  ],
  categoriaEstado,
);

router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "El id no es valido").isMongoId().bail().custom(categoriaExiste),
    validarCampos,
  ],
  categoriaDelete,
);

module.exports = router;
