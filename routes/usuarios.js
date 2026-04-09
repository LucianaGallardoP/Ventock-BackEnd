const { Router } = require("express");
const {
  usuarioPost,
  usuariosGet,
  usuarioGetID,
  usuarioPut,
  usuarioEstado,
  usuarioDelete,
} = require("../controllers/usuarios");

const router = Router();

router.get("/", usuariosGet);

router.get("/:id", usuarioGetID);

router.post("/", usuarioPost);

router.put("/:id", usuarioPut);

router.patch("/:id", usuarioEstado);

router.delete("/:id", usuarioDelete);

module.exports = router;
