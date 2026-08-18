const { pool } = require("../config");

exports.Profile = async (id) => {
  const getuserCmd = `SELECT * from users WHERE id=?`;
  try {
    const userinfo = await pool.execute(getuserCmd, [id]);
    return { userinfo };
  } catch (error) {
    console.error(error);
  }
};
exports.freinds = (id) => {
  const getFriendsCmd = `
    SELECT u.fullNmae, u.image, u.skill,  u.language, u.location, u.bio 
    FROM user_friends uf
    JOIN users u ON u.id = uf.friend_id
    WHERE uf.user_id = ?
`;
  return pool.execute(getFriendsCmd, [id]);
};
exports.update = (data) => {
  const onbordingCmd = `UPDATE users
SET fullName = ?,
    skill = ?,
    language = ?,
    location = ?,
    bio = ?,
    isOnboarded = TRUE
WHERE id = ?;
`;
  return pool.execute(onbordingCmd, data);
};
exports.recommendedUsers = async (id) => {
  const userCmd = `SELECT skill, language, location FROM users WHERE id=?`;
  const getRecomdedFriend = `SELECT id, fullName, image, bio FROM users  WHERE id != ? AND (skill = ?
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
      throw new Error("no user in this id");
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
exports.createFriendRequest = async (senderId, receiverId) => {
  try {
    // 1. Check if receiver exists

    const [user] = await pool.execute(`SELECT id FROM users WHERE id = ?`, [
      receiverId,
    ]);

    if (user.length === 0) {
      return { status: 404, reason: "USER_NOT_FOUND" };
    }

    // 2. Check if already friends
    const [friend] = await pool.execute(
      `
    SELECT 1
    FROM user_friends
    WHERE user_id = ? AND friend_id = ?
    LIMIT 1
    `,
      [senderId, receiverId],
    );

    if (friend.length > 0) {
      return { status: 400, reason: "ALREADY_FRIENDS" };
    }

    // 3. Check if request is already pending
    const [request] = await pool.execute(
      `
    SELECT 1
    FROM friend_requests
    WHERE sender_id = ?
      AND receiver_id = ?
      AND status = 'pending'
    LIMIT 1
    `,
      [senderId, receiverId],
    );

    if (request.length > 0) {
      return { status: 400, reason: "REQUEST_ALREADY_SENT" };
    }

    // Create request
    await pool.execute(
      `
    INSERT INTO friend_requests (sender_id, receiver_id)
    VALUES (?, ?)
    `,
      [senderId, receiverId],
    );

    return { status: 200, reason: "REQUEST_SENT SUCCESSFULLY" };
  } catch (error) {
    throw new Error(error);
  }
};
exports.resiveFriendsRequst = async (myId, FriendId, states) => {
  const isThereFriend = `SELECT 1 FROM  users WHERE id=? AND isOnboarded=true`;
  const isThereReq = `SELECT 1 FROM friend_requests where sender_id=? AND receiver_id=?`;
  const areTheyFriend = `SELECT 1 FROM  user_friends WHERE friend_id=? AND user_id=?`;
  const acceptRequest = `UPDATE friend_requests SET status=? WHERE sender_id = ? AND receiver_id = ?;`;
  const addToEachOtherFriendTable = ` INSERT INTO user_friends (user_id, friend_id)VALUES (?, ?), (?, ?);`;

  try {
    //check  if the user is authorized
    const [userResult] = await pool.execute(isThereFriend, [FriendId]);
    if (userResult.length === 0) {
      return { status: 400, message: "THIS USER IS NOT SIGN UP " };
    }
    const [friendResult] = await pool.execute(areTheyFriend, [FriendId, myId]);
    if (friendResult.length !== 0) {
      return { status: 400, message: "YOU ARE FRIENDS ALREADY" };
    }
    const [requestResult] = await pool.execute(isThereReq, [FriendId, myId]);
    if (requestResult.length === 0) {
      return { status: 404, message: "NO REQUEST FROM THAT ID" };
    }
    const [updateResult] = await pool.execute(acceptRequest, [
      states,
      FriendId,
      myId,
    ]);
    if (updateResult.affectedRows === 0) {
      throw new Error("Friend request was not found or could not be updated.");
    }
    if (states === "rejected") {
      return {
        status: 200,
        message: "REJECTED SUCCESSFULLY",
      };
    }

    await pool.execute(addToEachOtherFriendTable, [
      FriendId,
      myId,
      myId,
      FriendId,
    ]);
    return {
      status: 201,
      message: "congragratulation you accept request successfully",
    };
  } catch (error) {
    throw new Error(error);
  }
};
exports.incomingRequest = (id) => {
  const sql = `
    SELECT 
      u.fullName,
      u.location,
      u.image,
      u.skill,
      u.language,
      fr.created_at,
      fr.status
    FROM friend_requests fr
    JOIN users u ON u.id = fr.sender_id
    WHERE fr.receiver_id = ?
      AND fr.status = 'pending'
    ORDER BY fr.created_at DESC
`;

  return pool.execute(sql, [id]);
};
exports.acceptedRequest = (id) => {
  const sql = `SELECT u.fullName,u.location,u.image,u.skill,u.language,fr.created_at , fr.status FROM friend_requests fr JOIN users u ON u.id = fr.sender_id WHERE fr.receiver_id=? AND fr.status='accepted' ORDER BY fr.created_at DESC; `;
  return pool.execute(sql, [id]);
};
exports.outGoingRequets = (id) => {
  const sql = `SELECT u.fullName,u.location,u.image,u.skill,u.language,fr.created_at, fr.status FROM friend_requests fr JOIN users u ON u.id=fr.receiver_id WHERE fr.sender_id=? AND fr.status='pending' ORDER BY fr.created_at DESC; `;
  return pool.execute(sql, [id]);
};
