const { Router } = require("express");

const {
  categoriasGet,
  categoriaGetID,
  categoriaPost,
  categoriaPut,
  categoriaEstado,
  categoriaDelete,
} = require("../controllers/categorias");

const router = Router();

router.get("/", categoriasGet);

router.get("/:id", categoriaGetID);

router.post("/", categoriaPost);

router.put("/:id", categoriaPut);

router.patch("/:id", categoriaEstado);

router.delete("/:id", categoriaDelete);

module.exports = router;
