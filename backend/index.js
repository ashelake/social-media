const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const connection = require("./config/db");
const post = require("./routes/post");
const user = require("./routes/user");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

app.use(cookieParser());
app.use("/", post);
app.use("/", user);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Listing to port");
  } catch (error) {
    console.log(error);
  }
});
