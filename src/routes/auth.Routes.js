const Router = require("express").Router();
const {sign_in, sign_up,sign_out,refresh_token} = require("../controllers/auth.Controller");
Router.post("/sign_in", sign_in);
Router.post("/sign_up", sign_up);
Router.post('/log_out',sign_out);
Router.post('/refresh',refresh_token);
module.exports = Router;
