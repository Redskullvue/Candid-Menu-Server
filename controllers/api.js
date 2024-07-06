const Post = require("../models/posts");
const fs = require("fs");

module.exports = class API {
  // To in Class Mikhaym Baray Fetch all posts update post va ... api ro besazim

  //   Fetch All posts
  static async fetchAllPost(req, res) {
    try {
      const posts = await Post.find();
      res.status(200).json(posts);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }
  // Fetch post by id
  static async fetchPostById(req, res) {
    const id = req.params.id;
    try {
      const post = await Post.findById(id);
      post.items.sort((a, b) => a.index - b.index);
      await post.save();
      res.status(200).json(post);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  // Create a post
  static async createPost(req, res) {
    const post = req.body;
    try {
      await Post.create(post);
      res.status(201).json({ message: "Category Created Succesfully" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
  // Update a post
  static async updatePost(req, res) {
    const id = req.params.id;
    let newImage = "";
    if (req.file) {
      newImage = req.file.filename;
      try {
        fs.unlinkSync("./uploades/" + req.body.oldImage);
      } catch (error) {
        console.log(error);
      }
    } else {
      newImage = req.body.oldImage;
    }
    const newPost = req.body;

    newPost.image = newImage;
    try {
      await Post.findByIdAndUpdate(id, newPost);
      res.status(200).json({ message: "Post Updated Succesfully" });
    } catch (error) {
      res.status(404).json({ message: error });
    }
  }
  // Add New Item To Category
  static async addNewItem(req, res) {
    const id = req.params.id;
    const newItem = req.body;
    let itemImage;
    if (req.file) {
      itemImage = req.file.filename;
    }
    const category = await Post.findById(id);
    try {
      category.items.push({
        index: newItem.index,
        name: newItem.name,
        price: newItem.price,
        image: itemImage,
        category: newItem.category,
      });
      category.items.sort((a, b) => a.index - b.index);
      await category.save();
      res.status(200).json({ message: "Item Added  Successfully" });
    } catch {
      res.status(404).json({ message: err.message });
    }
  }
  // Delete a Post
  static async deletePost(req, res) {
    const id = req.params.id;
    try {
      const result = await Post.findByIdAndDelete(id);
      if (result.image != "") {
        try {
          fs.unlinkSync("./uploades/" + result.image);
        } catch (error) {
          console.log(error);
        }
      }
      res.status(200).json({ message: "Post Deleted Succesfully" });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
  static async deleteItem(req, res) {
    const catId = req.params.catId;
    const deleteItemId = req.params.itemId; // Replace with actual _id

    const deleteImage = async (imagePath) => {
      fs.unlinkSync("./uploades/" + imagePath);
    };

    const result = Post.updateOne(
      { _id: catId },
      { $pull: { items: { _id: deleteItemId } } }
    )
      .then((result) => {
        res.status(200).json({ message: "Item Deleted Successfully" });
      })
      .catch((err) => {
        res.status(404).json({ message: "There Was a problem" });
      });
    // const deletedItem = result.nModified ? result.upserted[0] : null; // Assuming upserted contains deleted item
    // console.log(deletedItem);
    const deletedItem = Post.findById(deleteItemId);
    // await deleteImage(deletedItem);
  }
  static async updateItemPrice(req, res) {
    const newValues = req.body;
    const catId = req.params.catId;
    const itemId = req.params.itemId;
    let itemImage;
    if (req.file) {
      itemImage = req.file.filename;
    }

    Post.updateOne(
      { _id: catId },
      {
        $set: {
          "items.$[i].price": newValues.price,
          "items.$[i].name": newValues.name,
          "items.$[i].index": newValues.index,
          "items.$[i].image": itemImage,
        }, // Update price using positional operator
      },
      { arrayFilters: [{ "i._id": { $eq: itemId } }] }
    ) // Filter by item _id
      .then((result) => {
        // category.items.sort((a, b) => a.index - b.index);
        res.status(200).json({ message: "Item Edited Successfully" });
      })
      .catch((err) => {
        console.error("Error Editing Item:", err);
      });
  }
};
