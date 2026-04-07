const { Router } = require("express");

const {
  categoriasGet,
  categoriaGetID,
  categoriaPost,
  categoriaPut,
  categoriaInhabilitada,
  categoriaDelete,
} = require("../controllers/categorias");

const router = Router();

router.get("/", categoriasGet);

router.get("/:id", categoriaGetID);

router.post("/", categoriaPost);

router.put("/:id", categoriaPut);

router.patch("/:id", categoriaInhabilitada);

router.delete("/:id", categoriaDelete);

module.exports = router;
