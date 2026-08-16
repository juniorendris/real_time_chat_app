const { pool } = require("../config");

exports.userData = async (id) => {
  const getuserCmd = `SELECT * from users WHERE id=?`;
  const getFriendsCmd = `
    SELECT u.*
    FROM user_friends uf
    JOIN users u ON u.id = uf.friend_id
    WHERE uf.user_id = ?
`;
  try {
    const userinfo = await pool.execute(getuserCmd, [id]);
    const userFreindInfo = await pool.execute(getFriendsCmd, [id]);
    return { userinfo, userFreindInfo };
  } catch (error) {
    console.error(error);
  }
};
exports.update = (data) => {
  const onbordingCmd = `UPDATE users
SET fullName = ?,
    skill = ?,
    language = ?,
    location = ?,
    bio = ?
WHERE id = ?;
`;
  return pool.execute(onbordingCmd, data);
};

exports.getRecomonded_friend = async (id) => {
  const userCmd = `SELECT skill, language, location FROM users WHERE id=?`;
  const getRecomdedFriend = `SELECT id, fullName, image, bio
FROM users 
WHERE id != ?
AND id
AND (
    skill = ?
    OR language = ?
    OR location = ?
)
    AND id NOT IN (
    SELECT uf.friend_id
    FROM user_friends uf
    WHERE uf.user_id = ?
);`;
  try {
    const [user] = await pool.execute(userCmd, [id]);
    if (user.length === 0) {
      return "no user in this id";
    }

    return pool.execute(getRecomdedFriend, [
      id,
      user[0].skill,
      user[0].language,
      user[0].location,
      id,
    ]);
  } catch (error) {
    throw new Error("dtatabe error");
  }
};
