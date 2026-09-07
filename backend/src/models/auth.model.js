const { pool } = require("../config");
exports.check_user = (email) => {
  const check_userCmd = `SELECT password ,id from  users WHERE email=?`;
  return pool.execute(check_userCmd, [email]);
};
exports.createUser = (data) => {
  const createUser = `INSERT INTO users(email,password,fullName,image) VALUES(?,?,?,?)`;
  return pool.execute(createUser, data);
};
