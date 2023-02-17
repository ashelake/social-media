const express = require("express");
const { creatPost, likeUnlike, deletePost } = require("../controller/post");
const { isAuthenticate } = require("../middleware/auth");

const router = express.Router();

router.route("/post/upload").post(isAuthenticate, creatPost);
router
  .route("/post/:id")
  .get(isAuthenticate, likeUnlike)
  .delete(isAuthenticate, deletePost);

module.exports = router;
