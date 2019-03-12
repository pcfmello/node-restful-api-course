const express = require("express");

const authMiddleware = require("../middlewares/auth");

const Project = require("../models/project");
const Tast = require("../models/task");

const router = express.Router();

// Executando o middleware do token antes da rota principal
router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().populate("user"); // populate() serve para trazer os dados do relacionamento (eager loading). Nesse caso, faz duas consultas, uma para trazer os projetos e outra para trazer o relacionamento.
    return res.send({ projects });
  } catch (error) {
    return res.status(400).send({ Error: "Error loading projects" });
  }
});

router.get("/:projectId", async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate(
      "user"
    );
    return res.send({ project });
  } catch (error) {
    return res.status(400).send({ Error: "Error loading project" });
  }
});

router.post("/", async (req, res) => {
  try {
    const project = await Project.create({ ...req.body, user: req.userId });

    return res.send({ project });
  } catch (err) {
    return res.status(400).send({ Error: "Error creating new projetct" });
  }
});

router.put("/:projectId", async (req, res) => {
  try {
    res.send({ user: req.userId });
  } catch (err) {
    return res.status(400).send({ Error: "Error updating new projetct" });
  }
});

router.delete("/:projectId", async (req, res) => {
  try {
    const project = await Project.findByIdAndRemove(req.params.projectId);
    return res.send();
  } catch (err) {
    return res.status(400).send({ Error: "Error deleting new projetct" });
  }
});

module.exports = app => app.use("/projects", router);
