const {auth}=require('../middlewares/auth');
const Router = require("express").Router();
const {
  sign_in,
  sign_up,
  sign_out,
  refresh_token,
  me,
} = require("../controllers/auth.Controller");
Router.post("/sign_in", sign_in);
Router.post("/sign_up", sign_up);
Router.post("/refresh", refresh_token);

//for log out and refreshtoken
Router.post("/sign_out",auth,sign_out);
module.exports = Router;
