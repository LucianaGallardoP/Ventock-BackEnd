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

const router = Router();

router.get("/", [validarJWT], categoriasGet);

router.get(
  "/:id",
  [
    validarJWT,
    check("id", "El id no es valido").isMongoId(),
    check("id").custom(categoriaExiste),
    validarCampos,
  ],
  categoriaGetID,
);

router.post(
  "/",
  [
    validarJWT,
    esAdminRole,
    check("nombre", "El nombre de la categoria es obligatorio").notEmpty(),
    validarCampos,
  ],
  categoriaPost,
);

router.put(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "El id no es valido").isMongoId(),
    check("id").custom(categoriaExiste),
    validarCampos,
  ],
  categoriaPut,
);

router.patch(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "El id no es valido").isMongoId(),
    check("id").custom(categoriaExiste),
    validarCampos,
  ],
  categoriaEstado,
);

router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "El id no es valido").isMongoId(),
    check("id").custom(categoriaExiste),
    validarCampos,
  ],
  categoriaDelete,
);

module.exports = router;
