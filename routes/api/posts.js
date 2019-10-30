const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const mongoose = require("mongoose");

// add route  get apu/posts
// description test route
// access public

// @route    POST api/posts
// @desc     Create a post
// @access   Private
router.post(
  "/",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty(),
      check("title", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        title: req.body.title,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
        tags: req.body.tags
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    GET api/posts
// @desc     Get all posts
// @access   Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate({
        path: "user",
        select: "-password -email -bio"
      })
      .populate("comments.user")
      .sort({
        date: -1
      });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//get all post by user id

router.get("/user/:id", auth, async (req, res, next) => {
  await Post.find({ user: req.params.id })
    .populate({
      path: "user",
      select: "-password -email -bio"
    })
    .populate("comments.user")
    .then(posts => {
      return res.json(posts);
    });
});

// @route    GET api/posts
// @desc     Get all posts
// @access   Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate({
        path: "user",
        select: "-password -email -bio"
      })
      .populate("comments.user")
      .sort({
        date: -1
      });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @get all tags

router.get("/tags", auth, async (req, res) => {
  try {
    Post.find()
      .distinct("tags")
      .then(function(tags) {
        console.log(tags);
        res.json(tags);
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route  get tags by tag
router.get("/getByTag", async function(req, res) {
  try {
    let tag = req.body.tag || req.query.tag;
    console.log(tag, 99);
    Post.find({ tags: tag })
      .populate({
        path: "user",
        select: "-password -email -bio"
      })
      .populate("comments.user")
      .then(function(posts) {
        console.log(posts, 101);
        return res.json(posts);
      });
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
});

// @route    GET api/posts/:id
// @desc     Get post by ID
// @access   Private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate({
        path: "user",
        select: "-password -email -bio"
      })
      .populate("comments.user");

    if (!post) {
      return res.status(404).json({
        msg: "Post not found"
      });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({
        msg: "Post not found"
      });
    }
    res.status(500).send("Server Error");
  }
});

// @route    DELETE api/posts/:id
// @desc     Delete a post
// @access   Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        msg: "Post not found"
      });
    }

    // Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({
        msg: "User not authorized"
      });
    }

    await post.remove();

    res.json({
      msg: "Post removed"
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({
        msg: "Post not found"
      });
    }
    res.status(500).send("Server Error");
  }
});

//edit post

router.put("/edit/:id", auth, async (req, res) => {
  try {
    console.log(req.params.id);
    await Post.findById(req.params.id).then(post => {
      console.log(post);
      post.title = req.body.title;
      (post.text = req.body.text), console.log(post.text);
      post.tags = req.body.tags;
      return post.save().then(() => {
        return res.json(post);
      });
    });

    if (!post) {
      return res.status(404).json({
        msg: "Post not found"
      });
    }

    res.json(post);

    if (post) {
      post = await Post.findByIdAndUpdate;
    }
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({
        msg: "Post not found"
      });
    }
    res.status(500).send("Server Error");
  }
});

router.get("/likedposts/:id", auth, async (req, res, next) => {
  let user = await User.findById(req.params.id).then(ele => ele);
  // console.log(user)
  await Post.find({ "likes.user": req.params.id })
    .populate("user")
    .then(posts => {
      console.log(8888888888);
      console.log(posts);
      return res.json(posts);
    });
});
// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({
        msg: "Post already liked"
      });
    }

    post.likes.unshift({
      user: req.user.id
    });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/posts/unlike/:id
// @desc     Like a post
// @access   Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({
        msg: "Post has not yet been liked"
      });
    }

    // Get remove index
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/posts/comment/:id
// @desc     Comment on a post
// @access   Private
router.post(
  "/comment/:id",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Pull out comment
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );

    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({
        msg: "Comment does not exist"
      });
    }

    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({
        msg: "User not authorized"
      });
    }

    // Get remove index
    const removeIndex = post.comments
      .map(comment => comment.id)
      .indexOf(req.params.comment_id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// get posts by user id
module.exports = router;
