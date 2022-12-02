const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("tasks", "root", "", {
  host: "localhost",
  port: "4000",
  dialect: "mysql",
});

try {
  sequelize.authenticate();
  console.log("Conectado com sucesso");
} catch (error) {
  console.log("Não consguimos conectar ao banco", error);
}

module.exports = sequelize;
