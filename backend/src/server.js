require("dotenv").config();
const express = require("express");
const cookie_parser = require("cookie-parser");
const cors = require("cors");
const app = express();
const path = require("path");
app.use(
  cors({
    origin:process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookie_parser());
const PORT = process.env.PORT || 3000;
const __direname=path.resolve();//get curent path
const { createTable } = require("./config");

app.use("/api/auth/", require("./routes/auth.Routes"));
app.use("/api/user/", require("./routes/user.Routes"));
app.use("/api/chat/", require("./routes/chat.Routes"));

// production deployment 
if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__direname,"../frontend/dist")));
  app.use((req,res)=>{
    res.sendFile(path.join(__direname,"../frontend/dist/index.html"));
  });}


app.listen(PORT, async () => {
  try {
    console.log(`server is running on port ${PORT} `);

    await createTable();
  } catch (error) {
    console.error(error);
  }
});
