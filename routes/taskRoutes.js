const express = require("express");
const router = express.Router();

const TaskController = require("../controllers/TaskController");

router.get("/add", TaskController.createTask);
router.post("/add", TaskController.createTaskPost);
router.post("/remove", TaskController.removeTask);
router.get("/details/:id", TaskController.detailsTask);
router.get("/edit/:id", TaskController.editTask);
router.post("/edit", TaskController.editTaskPost);
router.get("/", TaskController.showTasks);
module.exports = router;
