const { Router } = require("express");
const {
  productosGet,
  productoGetID,
  productoPost,
  productoPut,
  productoEstado,
  productoDelete,
} = require("../controllers/productos");

const router = Router();

router.get("/", productosGet);

router.get("/:id", productoGetID);

router.post("/", productoPost);

router.put("/:id", productoPut);

router.patch("/:id", productoEstado);

router.delete("/:id", productoDelete);

module.exports = router;
