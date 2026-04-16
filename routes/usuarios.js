const { Router } = require("express");
const { check } = require("express-validator");

const {
  usuarioPost,
  usuariosGet,
  usuarioGetID,
  usuarioPut,
  usuarioEstado,
  usuarioDelete,
} = require("../controllers/usuarios");
const { validarJWT } = require("../middlewares/validarJWT");
const {
  esSuperAdminRole,
  esAdminRole,
} = require("../middlewares/validarRoles");
const {
  usuarioExiste,
  emailExiste,
  esRolValido,
} = require("../helpers/db-validator");
const { validarCampos } = require("../middlewares/validarCampos");

const router = Router();

router.get("/", 
  [validarJWT, esSuperAdminRole], 
  usuariosGet);

router.get(
  "/:id",
  [
    check("id", "El id no es valido").isMongoId(),

    check("id").custom(usuarioExiste),

    validarCampos,
  ],
  usuarioGetID,
);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").notEmpty(),
    check("apellido", "El apellido es obligatorio").notEmpty(),
    check("correo").custom(emailExiste),
    check(
      "password",
      "La contraseña debe tener un minimo de 8 caracteres",
    ).isLength({ min: 8 }),
    check("rol").custom(esRolValido),
    validarCampos,
  ],
  usuarioPost,
);

router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(usuarioExiste),
    validarCampos,
  ],
  usuarioPut,
);

router.patch(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(usuarioExiste),
    validarCampos,
  ],
  usuarioEstado,
);

router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(usuarioExiste),
    validarCampos,
  ],
  usuarioDelete,
);

module.exports = router;
