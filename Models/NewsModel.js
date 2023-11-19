const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    urlToImage: String,
    author: String,
    publishedAt: Date,
    source: {
      id: String,
      name: String,
    },
  },
  {
    collection: "articles",
  }
);

module.exports = mongoose.model("News", newsSchema);
