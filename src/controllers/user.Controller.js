const { upsetStreamUser } = require("../config/streamChat");

const { update, userData, getRecomonded_friend } = require("../models/user.model");
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
    const { userinfo, userFreindInfo } = await userData(id);
    if (userinfo.length === 0) {
      res.status(404).json({ message: "no user " });
    }

    delete userinfo[0].password;
    res.status(200).json({
      user: userinfo[0],
      userFriend: userFreindInfo[0],
    });
  } catch (error) {
    console.error(error);
  }
};
exports.getRecomondedFriend = async (req, res) => {
  const { id } = req.user;
  try {
    const [rows] = await getRecomonded_friend(id);

   return res.status(200).json({
      message: "recomoneded user are sent successfully",
      getFriend: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error " });
  }
};
