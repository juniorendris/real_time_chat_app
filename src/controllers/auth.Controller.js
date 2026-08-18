const { createUser, check_user } = require("../models/auth.model");
const validator = require("validator");
const { upsetStreamUserSign_up } = require("../config/streamChat");
const bcrypt = require("bcrypt");
const { asign_token, verifyRefreshToken } = require("../utils/jwt"); //need id as pay load
exports.sign_up = async (req, res) => {
  const { email, password, fullName } = req.body||{};
  if (!email || !password || !fullName) {
    console.log("required data is not fullfild");
    return res
      .status(401)
      .json({ message: "be sure  you have fulfild required information" });
  }
  const isemail = await validator.isEmail(email);
  if (!isemail) {
    console.log(" in valid email type");
    return res.status(401).json({ message: "invalid format of email" });
  }
  if (password.length < 6) {
    console.log("password must be atlist 7 charactore");
    return res.status(400).json({ message: "very short password" });
  }
  try {
    const [checkuser] = await check_user(email);
    if (checkuser.length !== 0) {
      console.log("user already have an acount");
      return res.status(400).json({ message: "user already have an acount" });
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    // Generate a random string seed
    const randomSeed = Math.random().toString(36).substring(2, 9);

    // Construct dynamic URL
    const avatarUrl = `https://api.dicebear.com/10.x/avataaars/svg?borderRadius=50&translateX=0&translateY=3&scale=0.48&seed=${randomSeed}`;
    const data = [email, hashedpassword, fullName, avatarUrl];
    const [response] = await createUser(data);

    //create user in stream chat
     await upsetStreamUserSign_up({
      id:response.insertId.toString(),
        name: fullName,
      image: avatarUrl || "",
    
    });

    if (response.affectedRows === 0) {
      console.log("User could not be inserted");
      throw new Error("User could not be inserted");
    }

    const id = response.insertId;
    const { ACCESS_TOKEN, REFRESH_TOKEN } = asign_token(id);
    res.cookie("REFRESH_TOKEN", REFRESH_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res
      .status(201)
      .json({ ACCESS_TOKEN, message: "user successfully sign up" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.sign_in = async (req, res) => {
  const { email, password } = req.body||{};
  if (!email || !password) {
    return res.json({ messsage: "pleace fulfil requird information!" });
  }
  try {
    const [checkuser] = await check_user(email);
    if (checkuser.length === 0) {
      return res.status(400).json({ message: "user not found" });
    }

    const ismatch = await bcrypt.compare(password, checkuser[0].password);
    if (!ismatch) {
      return res.status(400).json({ message: "invalid password" });
    }
    const id = checkuser[0].id;
    const { ACCESS_TOKEN, REFRESH_TOKEN } = asign_token(id);
    res.cookie("REFRESH_TOKEN", REFRESH_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res
      .status(201)
      .json({ ACCESS_TOKEN, message: "user successfully sign in" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error " });
  }
};
exports.refresh_token = async (req, res) => {
  const { REFRESH_TOKEN: oldRefresh_token } = req.cookies || {};

  if (!oldRefresh_token)
    return res.sendStatus(401).json({ message: "sign in" });

  try {
    const ismatch = verifyRefreshToken(oldRefresh_token);

    if (!ismatch) {
      return res.sendStatus(401).json({ message: "sign in please" });
    }

    const id = ismatch.id;

    const { ACCESS_TOKEN, REFRESH_TOKEN } = asign_token(id);

    res.cookie("REFRESH_TOKEN", REFRESH_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res
      .status(201)
      .json({ ACCESS_TOKEN, message: "user successfully sign in" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error " });
  }
};
