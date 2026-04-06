const { Router } = require("express");
const {
  usuarioPost,
  usuariosGet,
  usuarioGetID,
  usuarioPut,
  usuarioInhabilitado,
  usuarioDelete,
} = require("../controllers/usuarios");

const router = Router();

router.get("/", usuariosGet);

router.get("/:id", usuarioGetID);

router.post("/", usuarioPost);

router.put("/:id", usuarioPut);

router.patch("/:id", usuarioInhabilitado);

router.delete("/:id", usuarioDelete);

module.exports = router;
