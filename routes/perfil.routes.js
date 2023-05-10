const router = require("express").Router();

const actualLogged = require("../middleware/middleware.js")

router.get("/main", actualLogged, (req, res, next) => {
    res.render("perfiles/inicio.hbs");
}); 


router.get("/private", actualLogged, (req, res, next) => {
    res.render("perfiles/privado.hbs");
}); 





module.exports = router;