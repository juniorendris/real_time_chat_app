const { upsetStreamUser } = require("../config/streamChat");
const {
  update,
  Profile,
  recommendedUsers,
  freinds,
  createFriendRequest,
  resiveFriendsRequst,
} = require("../models/user.model");

exports.sign_out = async (req, res) => {
  try {
    res.clearCookie("REFRESH_TOKEN");
    res.status(200).json({ message: "logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error " });
  }
};
exports.onboarding = async (req, res) => {
  const { id } = req.user;

  const { fullName, skill, language, location, bio } = req.body;
  if (!fullName || !skill || !language || !location || !bio) {
    res.status(400).json({ message: "Missing required information" });
  }
  const data = [fullName, skill, language, location, bio, id];
  try {
    const [response] = await update(data);
    if (response.affectedRows === 0) {
      return res
        .status(400)
        .json({ message: "no such user please be sure that are sign up" });
    }

    await upsetStreamUser({
      id: id.toString(),
      name: fullName,
      skill: skill,
      language: language,
      location: location,
      bio: bio,
    });
    return res.status(200).json({
      message: "Onboarding completed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error " });
  }
};
exports.getProfile = async (req, res) => {
  const { id } = req.user;
  try {
    const { userinfo } = await Profile(id);
    if (userinfo.length === 0) {
      res.status(404).json({ message: "no user " });
    }

    delete userinfo[0].password;
    res.status(200).json({
      user: userinfo[0],
    });
  } catch (error) {
    console.error(error);
  }
};
exports.getRecomondedFriend = async (req, res) => {
  const { id } = req.user;
  try {
    const [rows] = await recommendedUsers(id);
    if (rows.length === 0) {
      res.json({ message: "NO FRIENDS" });
    }
    return res.status(200).json({
      message: "recomoneded user are sent successfully",
      getFriend: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error " });
  }
};
exports.getfreinds = async (req, res) => {
  const { id } = req.user;
  try {
    const [friends] = await freinds(id);
    res.status(200).json({ message: "friends sent successfully", friends });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};
exports.sendFriendRequest = async (req, res) => {
  const { id: sender } = req.user;
  const { id: resipient } = req.params;

  if (!resipient) {
    return res.status(400).json({ message: "Recipient id is needed" });
  }

  if (sender.toString() === resipient) {
    return res.status(400).json({
      message: "You can't send a friend request to yourself",
    });
  }

  try {
    const result = await createFriendRequest(sender, resipient);
    return res.status(result.status).json({ message: result.reason });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal error pleace try againn later" });
  }
};
exports.accept_friendRequest = async (req, res) => {
  const { id: myId } = req.user;
  const { id: freindId ,states} = req.params;
  if (!freindId || (states !== "rejected" &&  states !== "accepted")) {
    return res
      .status(400)
      .json({ message: "pleace sure you send id and states that" });
  }
  if (myId.toString() === freindId) {
    return res.status(400).json({
      message: "You can't accept a friend request from  yourself",
    });
  }
  try {
    const response =await resiveFriendsRequst(myId, freindId, states);
        res.status(response.status).json({message:response.message});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal error /serve error" });
  }
};

