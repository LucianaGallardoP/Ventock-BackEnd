const { Router } = require("express");

const {
  ventasGet,
  ventaGetID,
  ventaPost,
  ventaPut,
  anularVenta,
} = require("../controllers/ventas");

const router = Router();

router.get("/", ventasGet);

router.get("/:id", ventaGetID);

router.post("/", ventaPost);

router.put("/:id", ventaPut);

router.patch("/:id", anularVenta);

module.exports = router;
