"use strict";

const jwt = require("jsonwebtoken");
const { User } = require("../models");
class LoginController {
  index(req, res, next) {
    res.locals.error = "";
    res.render("login");
  }

  async post(req, res, next) {
    try {
      const { name, password } = req.body;

      // look for the user into the DB
      const user = await User.findOne({ name });

      // si no lo encuentro o no coincide la contraseña --> error
      if (!user || !(await user.comparePassword(password))) {
        res.locals.error = res.__("Invalid credentials");
        res.render("login");
        return;
      }

      // si lo encuentro y la contraseña coincide:
      // --> apuntar en su sesión que está autenticado (que se quien es)
      // --> redirigir a su zona privada

      req.session.userLogado = {
        _id: user._id,
      };

      // enviar un email al usuario
      // const result = await user.enviarEmail(
      //   "Esto es el asunto",
      //   "Bienvenido a Wallaclone"
      // );
      // console.log("Mensaje enviado:", result.messageId);
      // console.log("Ver mensaje:", result.getTestMessageUrl);

      res.redirect("../views/index.html");
    } catch (err) {
      next(err);
    }
  }

  // exit
  logout(req, res, next) {
    req.session.regenerate((err) => {
      if (err) {
        next(err);
        return;
      }
      res.redirect("/");
    });
  }

  // POST /api/login
  async postJWT(req, res, next) {
    try {
      const { name, password } = req.body;

      // buscar el usuario en la BD
      const user = await User.findOne({ name });

      // si no lo encuentro o no coincide la contraseña --> error
      if (!user || !(await user.comparePassword(password))) {
        res.json({ error: "Invalid credentials" });
        return;
      }

      // si el usuario existe y valida la contraseña
      // crear un JWT con el _id del usuario dentro
      jwt.sign(
        { _id: usuario._id },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRE,
        },
        (err, jwtToken) => {
          if (err) {
            next(err);
            return;
          }
          // devolver al cliente el token generado
          res.json({ token: jwtToken });
        }
      );
    } catch (err) {
      next();
    }
  }
}

module.exports = LoginController;
