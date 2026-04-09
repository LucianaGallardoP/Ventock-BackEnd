const { Router } = require("express");

const {} = require("../controllers/ventas");

const router = Router();

router.get("/");

router.get("/:id");

router.post("/");

router.put("/:id");

router.patch("/:id");

router.delete("/:id");

module.exports = router;
