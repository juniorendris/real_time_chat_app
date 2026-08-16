const Router = require("express").Router();
const { auth } = require("../middlewares/auth");
const {
  sign_out,
  getRecomondedFriend,
  onboarding,
  getProfile,
} = require("../controllers/user.Controller");

// midle ware
Router.use(auth);

//for log out and refreshtoken
Router.post("/log_out", sign_out);
// Router.post("/refresh", refresh_token);

//onboard

Router.post("/onboarding", onboarding);
Router.get("/profile", getProfile);
Router.get("/recomonded",getRecomondedFriend);
module.exports = Router;
