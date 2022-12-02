const User = require("../models/User");

const bcrypt = require("bcryptjs");

module.exports = class AuthController {
  static login(req, res) {
    res.render("auth/login");
  }

  static register(req, res) {
    res.render("auth/register");
  }

  static async loginPost(req, res) {
    const { email, password } = req.body;

    //verificar se o usuario existe
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      req.flash("message", "Usuario não encontrado");
      res.render("auth/login");
      return;
    }

    const checkPassword = bcrypt.compareSync(password, user.password);

    if (!checkPassword) {
      req.flash("message", "Senha invalida");
      res.render("auth/login");
      return;
    }

    try {
      // criar sessao
      req.session.userid = user.id;

      // salvar session
      req.session.save(() => {
        res.redirect("/");
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async registerPost(req, res) {
    const { name, email, password, confirmpassword } = req.body;

    // verificar senha
    if (password !== confirmpassword) {
      req.flash("message", "As senhas não conferem, tente novamente");
      res.render("auth/register");
      return;
    }

    const checkIfEmailExists = await User.findOne({ where: { email: email } });

    if (checkIfEmailExists) {
      req.flash("message", "Email já esta em uso");
      res.render("auth/register");
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const user = {
      name,
      email,
      password: hashPassword,
    };

    try {
      const createdUser = await User.create(user);

      // iniciar sessão - logar
      req.session.userid = createdUser.id;

      req.flash("message", "Cadastro realizado com sucesso");

      // salvar sessão
      req.session.save(() => {
        res.redirect("/");
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async logout(req, res) {
    req.session.destroy();
    res.redirect("/login");
  }
};
