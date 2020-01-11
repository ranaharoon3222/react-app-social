const express = require('express');
const router = express.Router();
const Profile = require('../../models/User');
const Profile = require('../../models/profile');

// Get ROute api/profile/me
// @desc Get Current User Profile
// Public route

router.get('/', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: rq.user.id }).populate(
      'user',
      ['name', 'avatar']
    );
    if (!profile) {
      res.status(400).json({ msg: 'There is no profile for this user ' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
