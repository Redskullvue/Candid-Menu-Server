const mongoose = require("mongoose");
const postSchema = mongoose.Schema({
  title: String,
  items: [{ name: String, price: String, image: String, category: String }],
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", postSchema);
