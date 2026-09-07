const { upsetStreamUser } = require("../config/streamChat");
const {
  update,
  Profile,
  recommendedUsers,
  freinds,
  createFriendRequest,
  deleteRequest,
  resiveFriendsRequst,
  incomingRequest,
  acceptedRequest,
  outGoingRequets,
} = require("../models/user.model");
exports.onboarding = async (req, res) => {
  const { id } = req.user;

  const { fullName, skill, language, location, bio, image } = req.body || {};
  if (!fullName || !skill || !language || !location || !bio || !image) {
    res.status(400).json({ message: "Missing required information" });
  }
  const data = [fullName, skill, language, location, bio, image, id];
  try {
    const [response] = await update(data);
    if (response.affectedRows === 0) {
      return res
        .status(400)
        .json({ message: "no such user please be sure that are sign up" });
    }

    await upsetStreamUser({
      id: id.toString(),
      set: {
        name: fullName,
        skill: skill,
        language: language,
        location: location,
        bio: bio,
      },
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
    const [userinfo] = await Profile(id);
    if (userinfo.length === 0) {
      res.status(404).json({ message: "no user " });
    }

    delete userinfo[0].password;
    delete userinfo[0].email;
    res.status(200).json({
      user: userinfo[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal error /serve error" });
  }
};
exports.getRecomondedFriend = async (req, res) => {
  const { id } = req.user;
  try {
    const [rows] = await recommendedUsers(id);
    if (rows.length === 0) {
      return res.status(200).json({ message: "NO FRIENDS" });
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
exports.deleteFriendRequest = async (req, res) => {
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
    const [result] = await deleteRequest(sender, resipient);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "you didnt request yet!" });
    }
    return res.status(200).json({ message: "✔unRequest succssfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal error pleace try againn later" });
  }
};
exports.accept_friendRequest = async (req, res) => {
  const { id: myId } = req.user;
  const { id: freindId, states } = req.params;
  if (!freindId || (states !== "rejected" && states !== "accepted")) {
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
    const response = await resiveFriendsRequst(myId, freindId, states);
    res.status(response.status).json({ message: response.message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal error /serve error" });
  }
};
exports.getfreindsRequest = async (req, res) => {
  const { id } = req.user;
  try {
    const [incommingRequestResult] = await incomingRequest(id);
    res.status(200).json({
      friendRegests: incommingRequestResult,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal error /serve error" });
  }
};
exports.getAcceptedfreindsRequest = async (req, res) => {
  const { id } = req.user;
  try {
    const [acceptedFriends] = await acceptedRequest(id);
    res.status(200).json({
      acceptedFriends,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal error /serve error" });
  }
};
exports.getOutGoingRequet = async (req, res) => {
  const { id } = req.user;
  try {
    const [rows] = await outGoingRequets(id);
    if (rows.length === 0) {
      return res.status(404).json({ message: "NO OUTOING REQUEST" });
    }
    res.status(200).json({
      outGoingRequets: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal error /serve error" });
  }
};
