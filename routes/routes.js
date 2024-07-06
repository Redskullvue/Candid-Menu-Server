const express = require("express");

const router = express.Router();

const API = require("../controllers/api");

const multer = require("multer");

// multer middleware;
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploades");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

let upload = multer({
  storage: storage,
}).single("image");
router.get("/", API.fetchAllPost);
router.get("/:id", API.fetchPostById);
router.post("/", upload, API.createPost);
router.patch("/edit/:id", upload, API.updatePost);
router.patch("/:id", upload, API.addNewItem);
router.delete("/:id", API.deletePost);
router.patch("/deleteItem/:catId/:itemId", API.deleteItem);
router.patch("/updateprice/:catId/:itemId", upload, API.updateItemPrice);

module.exports = router;
