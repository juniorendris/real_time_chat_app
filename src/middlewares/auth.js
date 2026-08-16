const { verifyAccessToken } = require("../utils/jwt");

exports.auth = async (req, res, next) => {
  const authorization= req.headers?.authorization;

  if (!authorization) {
    return res.status(401).json({ message: "unauthorized" });
  }
  const token = authorization.split(" ")[1];
  try {
    const ismatch = verifyAccessToken(token);
    if (!ismatch) {
      return res.status(401).json({ message: "unauthorized" });
    }

    req.user = ismatch;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "unauthorized" });
  }
};
