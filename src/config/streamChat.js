const { StreamChat } = require("stream-chat");
const api_key = process.env.STREAMING_API_KEY;
const api_key_secret = process.env.STREAMING_SECRET_KEY;

if (!api_key || !api_key_secret) {
  throw new Error("api_key or api_key_secret not found");
}
const client = StreamChat.getInstance(api_key, api_key_secret);


//upsetStream for signup
exports.upsetStreamUserSign_up=async (userData) => {
  try {
    await client.upsertUser(userData);
  } catch (error) {
    console.error("upserting user data", error);
  }
};
// upsetStream for onboarding
exports.upsetStreamUser = async (userData) => {
  try {
    await client.partialUpdateUser(userData);
  } catch (error) {
    console.error("upserting user data", error);
  }
};
//token
exports.generateToken = async (userId) => {
  const id = userId.toString();
  try {
    const token = client.createToken(id);
    return token;
  } catch (error) {
    console.error("upserting user data", error);
  }
};