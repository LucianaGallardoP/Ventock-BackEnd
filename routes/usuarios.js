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
const { esSuperAdminRole } = require("../middlewares/validarRoles");
const {
  usuarioExiste,
  emailExiste,
  emailExisteOtroUsuario,
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
    validarJWT,
    esSuperAdminRole,
    check("id", "El id no es valido").isMongoId().bail().custom(usuarioExiste),
    validarCampos,
  ],
  usuarioGetID,
);

router.post(
  "/",
  [
    validarJWT,
    esSuperAdminRole,
    check("nombre", "El nombre es obligatorio").isString().trim().notEmpty(),
    check("apellido", "El apellido es obligatorio")
      .isString()
      .trim()
      .notEmpty(),
    check("correo", "El correo no es valido")
      .isString()
      .trim()
      .isEmail()
      .bail()
      .custom(emailExiste),
    check(
      "password",
      "La contraseña debe tener un minimo de 8 caracteres",
    ).isLength({ min: 8 }),
    check("rol", "El rol no es valido")
      .isString()
      .bail()
      .custom(esRolValido),
    validarCampos,
  ],
  usuarioPost,
);

router.put(
  "/:id",
  [
    validarJWT,
    esSuperAdminRole,
    check("id", "No es un id valido").isMongoId().bail().custom(usuarioExiste),
    check("nombre", "El nombre no puede estar vacio")
      .optional()
      .isString()
      .trim()
      .notEmpty(),
    check("apellido", "El apellido no puede estar vacio")
      .optional()
      .isString()
      .trim()
      .notEmpty(),
    check("correo", "El correo no es valido")
      .optional()
      .isString()
      .trim()
      .isEmail()
      .bail()
      .custom(emailExisteOtroUsuario),
    check("password", "La contraseña debe tener un minimo de 8 caracteres")
      .optional()
      .isLength({ min: 8 }),
    check("rol", "El rol no es valido")
      .optional()
      .isString()
      .bail()
      .custom(esRolValido),
    validarCampos,
  ],
  usuarioPut,
);

router.patch(
  "/:id",
  [
    validarJWT,
    esSuperAdminRole,
    check("id", "No es un id valido").isMongoId().bail().custom(usuarioExiste),
    validarCampos,
  ],
  usuarioEstado,
);

router.delete(
  "/:id",
  [
    validarJWT,
    esSuperAdminRole,
    check("id", "No es un id valido").isMongoId().bail().custom(usuarioExiste),
    validarCampos,
  ],
  usuarioDelete,
);

module.exports = router;
