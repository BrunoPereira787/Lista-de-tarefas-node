const { DataTypes } = require("sequelize");
const db = require("../db/conn");

const User = require("./User");

const Task = db.define("Task", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// uma tarefa para um usuario
Task.belongsTo(User);
// um usuario para varias tarefas
User.hasMany(Task);

module.exports = Task;
