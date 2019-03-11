const express = require("express");

const authMiddleware = require("../middlewares/auth");

const router = express.Router();

// Executando o middleware do token antes da rota principal
router.use(authMiddleware);

router.get("/", (req, res) => {
  res.send({ OK: true, user: req.userId });
});

module.exports = app => app.use("/projects", router);
