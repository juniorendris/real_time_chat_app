require("dotenv").config();
const express = require("express");
const cookie_parser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(cookie_parser());
const PORT = process.env.PORT || 3000;
const { createTable } = require("./config");
app.use("/api/auth/", require("./routes/auth.Routes"));

app.listen(PORT, async () => {
  try {
    console.log(`server is running on port ${PORT} `);

    await createTable();
  } catch (error) {
    console.error(error);
  }
});
