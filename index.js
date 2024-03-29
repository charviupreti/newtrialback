const express = require("express");

const cors = require("cors");
const app = express();
const authRoute = require("./Routes/AuthRoute");
require("dotenv").config();
const { MONGO_URL, PORT } = process.env;
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.use(cors());
app.use(express.json());
app.use("/", authRoute);
