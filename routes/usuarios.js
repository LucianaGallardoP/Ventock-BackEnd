const { Router } = require("express");
const { usuarioPost } = require("../controllers/usuarios");

const router = Router();

// router.get("/");

// router.get("/:id");

router.post("/", usuarioPost);

// router.put("/:id");

// router.delete("/:id");

module.exports = router;