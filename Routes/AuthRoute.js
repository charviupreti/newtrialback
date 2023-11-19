const { Signup, Login } = require("../Controllers/AuthController");
const { userVerification } = require("../Middlewares/AuthMiddleware");
const router = require("express").Router();
const User = require("../Models/UserModel");
const NEWS = require("../Models/NewsModel");
const axios = require("axios");
require("dotenv").config();
const mongoose = require("mongoose");
router.post("/signup", Signup);
router.post("/login", Login);
router.post("/userInfo", userVerification);

router.delete("/userInfo/:id", async (req, res) => {
  const user = await User.findOneAndDelete({ _id: req.params.id });
  if (user) {
    res.json({ status: true, message: "User deleted successfully" });
  } else {
    res.json({ status: false, message: "User not found" });
  }
});

router.put("/userInfo/:id", async (req, res) => {
  try {
    const data = await User.findByIdAndUpdate(
      new mongoose.Types.ObjectId(req.params.id),
      { $set: { preferences: req.body.preferences } }
    );
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.get("/news", async (req, res) => {
  try {
    const { topic } = req.query;
    console.log(topic);
    await NEWS.deleteMany({});

    const apiKey = process.env.NEWSAPI;
    const apiUrl = topic
      ? `https://newsapi.org/v2/everything?q=${topic}&apiKey=${apiKey}`
      : `https://newsapi.org/v2/top-headlines?country=in&apiKey=${apiKey}`;
    const response = await axios.get(apiUrl);
    const newsData = response.data.articles.map((article) => ({
      title: article.title,
      description: article.description,
      urlToImage: article.urlToImage,
      author: article.author,
      publishedAt: new Date(article.publishedAt),
      source: {
        id: article.source.id,
        name: article.source.name,
      },
    }));

    await NEWS.insertMany(newsData);
    console.log("News saved to database");

    const data = await NEWS.find({});
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching and saving news");
  }
});

module.exports = router;
