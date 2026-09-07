const Router = require("express").Router();
const { auth } = require("../middlewares/auth");
const {
  getRecomondedFriend,
  onboarding,
  getProfile,
  getfreinds,
  sendFriendRequest,
  deleteFriendRequest,
  accept_friendRequest,
  getfreindsRequest,
  getAcceptedfreindsRequest,
  getOutGoingRequet,
} = require("../controllers/user.Controller");

// midle ware
Router.use(auth);

//onboard
Router.get("/", getRecomondedFriend);

Router.patch("/onboarding", onboarding);

Router.get("/authUser", getProfile);

Router.get("/friends", getfreinds);

Router.get("/friend-request", getfreindsRequest);
Router.get("/accepted-friend-request", getAcceptedfreindsRequest);
Router.get("/friend-request/outgoing", getOutGoingRequet);

Router.post("/friend-request/:id", sendFriendRequest);
Router.delete("/delete-friend-request/:id", deleteFriendRequest);
Router.post("/friend-request/:id/:states", accept_friendRequest);

module.exports = Router;
