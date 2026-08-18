const Router = require("express").Router();
const { auth } = require("../middlewares/auth");
const {
  sign_out,
  getRecomondedFriend,
  onboarding,
  getProfile,
  getfreinds,
  sendFriendRequest,
  accept_friendRequest,
  getfreindsRequest,
  getOutGoingRequet,
} = require("../controllers/user.Controller");

// midle ware
Router.use(auth);

//for log out and refreshtoken
Router.post("/log_out", sign_out);

//onboard
Router.get("/", getRecomondedFriend);

Router.post("/onboarding", onboarding);

Router.get("/profile", getProfile);

Router.get("/friends", getfreinds);

Router.get("/friend-request", getfreindsRequest);

Router.get("/friend-request/outgoing", getOutGoingRequet);

Router.post("/friend-request/:id", sendFriendRequest);

Router.post("/friend-request/:id/:states", accept_friendRequest);

module.exports = Router;
