const router = require("express").Router();
const User = require("../models/User.model");

const bcrypt = require("bcryptjs");

// GET "/"
router.get("/", (req, res, next) => {
  res.render("crear-usuario/signup.hbs");
});

// GET "/signup"
router.get("/signup", (req, res, next) => {
  res.render("crear-usuario/signup.hbs");
});

// POST "/signup"
router.post("/signup", async (req, res, next) => {
  console.log(req.body);
  try {
    // Validaciones
    if (req.body.username === "" || req.body.password === "") {
      console.log("Campos Vacios");
      res.render("crear-usuario/signup.hbs", {
        errorMessage: "Campos Vacios",
      });
      return;
    }

    // Validacion de contraseña
    const regexPatter = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
    if (regexPatter.test(req.body.password) === false) {
      res.render("crear-usuario/signup.hbs", {
        errorMessage:
          "La contraseña debe ser mas fuerte, debe contener al menos 8 caracteres, una mayuscula y una minuscula",
      });
      return;
    }

    // Usuario unico en la base de datos
    const foundUser = await User.findOne({ username: req.body.username });
    if (foundUser !== null) {
      res.render("crear-usuario/signup.hbs", {
        errorMessage: "El usuario ya existe",
      });
    }

    // Encriptado de clave
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    console.log(hashedPassword);

    const response = await User.create({
      username: req.body.username,
      password: hashedPassword,
    });

    res.redirect("/");
  } catch (error) {}
});

// GET "/login"
router.get("/login", (req, res, next) => {
  res.render("crear-usuario/login.hbs");
});

// POST "/login"

router.post("/login", async (req, res, next) => {
  console.log(req.body);

  try {
    // Validaciones
    if (req.body.username === "" || req.body.password === "") {
      console.log("Campos Vacios");
      res.render("crear-usuario/login.hbs", {
        errorMessage: "Campos Vacios llenalos flojo",
      });
      return;
    }

    const foundUser = await User.findOne({ username: req.body.username });
    if (foundUser === null) {
      console.log("Usuario no encontrado");
      res.render("crear-usuario/login.hbs", {
        errorMessage: "Usuario no encontrado",
      });
      return;
    }
    console.log(foundUser);

    const validPassword = await bcrypt.compare(
      req.body.password,
      foundUser.password
    );
    console.log(validPassword);
    if (validPassword === false) {
      console.log("Contraseña incorrecta");
      res.render("crear-usuario/login.hbs", {
        errorMessage: "Contraseña incorrecta",
      });
      return;
    }
    req.session.user = foundUser;
    req.session.save(() => {
      res.redirect("/");
    });
  } catch (error) {}
});

module.exports = router;