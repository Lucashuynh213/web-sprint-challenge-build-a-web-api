const express = require("express");
const Projects = require("./projects-model");
const router = express.Router();

// [GET] /api/projects
router.get("/", async (req, res) => {
  try {
    const projects = await Projects.get();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving projects" });
  }
});

// [GET] /api/projects/:id
router.get("/:id", async (req, res) => {
  try {
    const project = await Projects.get(req.params.id);
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error retrieving project" });
  }
});

// [POST] /api/projects
router.post("/", async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res
      .status(400)
      .json({ message: "Name and description are required" });
  }
  try {
    const newProject = await Projects.insert(req.body);
    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ message: "Error creating project" });
  }
});

// [PUT] /api/projects/:id
router.put("/:id", async (req, res) => {
  const changes = req.body;
  // Check for required fields
  if (
    !changes.name ||
    !changes.description ||
    changes.completed === undefined
  ) {
    return res
      .status(400)
      .json({
        message: "Name, description, and completed status are required",
      });
  }
  try {
    const updatedProject = await Projects.update(req.params.id, changes);
    if (updatedProject) {
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error updating project" });
  }
});
// [DELETE] /api/projects/:id
router.delete("/:id", async (req, res) => {
  try {
    const count = await Projects.remove(req.params.id);
    if (count) {
      res.status(204).end(); // No content
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error deleting project" });
  }
});

// [GET] /api/projects/:id/actions
router.get("/:id/actions", async (req, res) => {
  try {
    const projectActions = await Projects.getProjectActions(req.params.id);
    if (projectActions.length > 0) {
      res.json(projectActions);
    } else {
      const project = await Projects.get(req.params.id);
      if (project) {
        res.json([]); // Return empty array if project exists but has no actions
      } else {
        res.status(404).json({ message: "Project not found" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: "Error retrieving project actions" });
  }
});

module.exports = router;
