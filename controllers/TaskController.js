const { where } = require("sequelize");
const Task = require("../models/Task");
const User = require("../models/User");

module.exports = class TaskController {
  static async showTasks(req, res) {
    const UserId = req.session.userid;

    try {
      const user = await User.findOne({
        where: { id: UserId },
        include: Task,
      });

      if (!user) {
        res.redirect("/login");
      }

      const tasks = user.Tasks.map((results) => results.dataValues);
      res.render("tasks/home", { tasks });
    } catch (error) {
      console.log(error);
    }
  }

  static createTask(req, res) {
    res.render("tasks/create");
  }

  static async createTaskPost(req, res) {
    const task = {
      title: req.body.title,
      description: req.body.description,
      UserId: req.session.userid,
    };

    try {
      await Task.create(task);
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  }

  static async removeTask(req, res) {
    const id = req.body.id;
    const UserId = req.session.userid;

    await Task.destroy({ where: { id: id, UserId: UserId } });
    res.redirect("/");
    try {
    } catch (error) {
      console.log(error);
    }
  }

  static async detailsTask(req, res) {
    const id = req.params.id;
    const UserId = req.session.userid;

    try {
      const task = await Task.findOne({
        where: { id: id, UserId: UserId },
        raw: true,
      });
      res.render("tasks/details", { task });
    } catch (error) {
      console.log(error);
    }
  }

  static async editTask(req, res) {
    const id = req.params.id;
    const UserId = req.session.userid;

    try {
      const task = await Task.findOne({
        where: { id: id, UserId: UserId },
        raw: true,
      });
      res.render("tasks/edit", { task });
    } catch (error) {
      console.log(error);
    }
  }

  static async editTaskPost(req, res) {
    const id = req.body.id;
    const UserId = req.session.userid;

    const task = {
      title: req.body.title,
      description: req.body.description,
    };

    try {
      await Task.update(task, {
        where: { id: id, UserId: UserId },
        raw: true,
      });
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  }
};
