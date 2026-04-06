const { Router } = require("express");
const { usuarioPost, usuariosGet, usuarioGetID, usuarioPut } = require("../controllers/usuarios");

const router = Router();

router.get("/", usuariosGet);

router.get("/:id", usuarioGetID);

router.post("/", usuarioPost);

router.put("/:id", usuarioPut);

// router.delete("/:id");

module.exports = router;