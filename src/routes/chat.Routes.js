const {getStreamToken}=require('../controllers/chat.Controller');
const Router = require("express").Router();
const { auth } = require("../middlewares/auth");

// midlleware
Router.use(auth);

//chat routes
Router.get('/token',getStreamToken);
module.exports = Router;
