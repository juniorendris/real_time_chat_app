const jwt = require("jsonwebtoken");
exports.asign_token = (payload) => {
  // 15 minutes * 60 seconds = 900
  const ACCESS_TOKEN = jwt.sign({ id: payload }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 900,
  });
const  REFRESH_TOKEN= jwt.sign(
  { id: payload }, 
  process.env.REFRESH_TOKEN_SECRET, 
  { expiresIn: '7d' }
);

  return({ACCESS_TOKEN,REFRESH_TOKEN});
};
exports.verify=(token)=>{
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}
