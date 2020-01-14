const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Post = require('../../models/post');
const User = require('../../models/User');
const Profile = require('../../models/profile');

/// ...rest of the initial code omitted for simplicity.
const { check, validationResult } = require('express-validator');

// Post  api/posts
// Create a Post
// @access private

router.post(
  '/',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });
      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Post  api/posts
// GET all Post
// @access private

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Post  api/posts/:id
// GET  Post by id
// @access private

router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not Found' });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not Found' });
    }
    res.status(500).send('Server Error');
  }
});

// Post  api/posts/:id
// Delete  Post by id
// @access private

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not Found' });
    }
    //check User
    if (post.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'User Not authorized' });
    }
    await post.remove();
    res.json({ msg: 'Post Removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not Found' });
    }
    res.status(500).send('Server Error');
  }
});

// PUT  api/posts/like/:id
// like post by id
// @access private

router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: 'User already liked this post' });
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not Found' });
    }
    res.status(500).send('Server Error');
  }
});

// PUT  api/posts/unlike/:id
// Delete  Post by id
// @access private

router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: 'Post has not been yet liked' });
    }
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);

    await post.save();
    res.json(post.likes);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not Found' });
    }
    res.status(500).send('Server Error');
  }
});

// Post  api/posts/comments/:id
// Comments
// @access private

router.post(
  '/comment/:id',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
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
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Post not Found' });
      }
      res.status(500).send('Server Error');
    }
  }
);

// delete  api/posts/comments/:id/:comment_id
// Comments delete
// @access private

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // pull out comment
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );
    if (!comment) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    // check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    const removeIndex = post.comments
      .map(comment => comment.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removeIndex, 1);

    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not Found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
