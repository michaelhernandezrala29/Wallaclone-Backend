"use strict";

const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { User } = require("../../models");

// POST /authenticate
router.post("/", async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const hashedPassword = User.hashPassword(password);

    const user = await User.findOne({
      name: name,
      email: email,
      password: hashedPassword,
    });

    if (!user) {
      // credentials ok
      res.json({ ok: false, error: "invalid credentials" });
      return;
    }

    // el usuario está y coincide la password

    // creamos el token
    jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      },
      (err, token) => {
        if (err) {
          return next(err);
        }
        // respondemos con un JWT
        res.json({ ok: true, token: token });
      }
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
