const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

const signupRouter = require("./signup.routes.js"); 
router.use("/auth", signupRouter);

module.exports = router;
