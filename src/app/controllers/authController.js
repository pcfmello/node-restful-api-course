const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user.js"); // Model User
const authConfig = require("../../config/auth.json");

const router = express.Router();

function generateToken(params = {}) {
  return jwt.sign({ params }, authConfig.secret, {
    expiresIn: 86400 // Um dia
  });
}

/**
 * POST: /auth/register
 *
 * */
router.post("/register", async (req, res) => {
  try {
    const { email } = req.body;

    if (await User.findOne({ email }))
      return res.status(400).send({ Error: "User is already exists" });

    const user = await User.create(req.body);

    const token = generateToken({ id: user.id });

    return res.send({ user, token: generateToken({ id: user.id }) });
  } catch (err) {
    return res
      .status(400)
      .send({ Error: "Registration failed", stack: err.stack });
  }
});

router.post("/authenticate", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password"); // +password indica para o campo password vir preenchido, pois está false no schema

  if (!user) return res.status(400).send({ Error: "User not found" });

  if (!(await bcrypt.compare(password, user.password)))
    return res.status(400).send({ Error: "Invalid password" });

  user.password = undefined;

  const token = generateToken({ id: user.id });

  res.send({ user, token: generateToken({ id: user.id }) });
});

/**
 * Usando o app repassado através do require do index
 * e será acessada através de /auth
 * */
module.exports = app => app.use("/auth", router);
