const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Profile = require('../../models/profile');
const User = require('../../models/User');
/// ...rest of the initial code omitted for simplicity.
const { check, validationResult } = require('express-validator');

// Get ROute api/profile/me
// @desc Get Current User Profile
// Public route

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      res.status(400).json({ msg: 'There is no profile for this user ' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @Post  api/profile
// @desv Create or update user profile
// @access private

router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Skills is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubusername,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    // @build profile fields
    const Profilefields = {};
    Profilefields.user = req.user.id;
    if (company) Profilefields.company = company;
    if (website) Profilefields.website = website;
    if (status) Profilefields.status = status;
    if (location) Profilefields.location = location;
    if (bio) Profilefields.bio = bio;
    if (githubusername) Profilefields.githubusername = githubusername;

    if (skills) {
      Profilefields.skills = skills.split(',').map(skill => skill.trim());
    }

    // @build social object
    Profilefields.social = {};
    if (youtube) Profilefields.social.youtube = youtube;
    if (facebook) Profilefields.social.facebook = facebook;
    if (instagram) Profilefields.social.instagram = instagram;
    if (linkedin) Profilefields.social.linkedin = linkedin;
    if (twitter) Profilefields.social.twitter = twitter;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        // update profile
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: Profilefields },
          { new: true }
        );
        return res.json(profile);
      }
      //create profile

      profile = new Profile(Profilefields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @GET  api/profile
// @desc Get all profiles
// @access public

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @GET  api/profile/user/user_id
// @desc Get user profile
// @access public

router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      res.status(400).json({ msg: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @Delete  api/profile
// @desc Delete profile, user & Posts
// @access private

router.delete('/', auth, async (req, res) => {
  try {
    // delete user profile
    await Profile.findOneAndDelete({ user: req.user.id });
    // delete user
    await User.findOneAndDelete({ _id: req.user.id });

    res.json({ msg: 'user deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @Delete  api/profile
// @desc Delete profile, user & Posts
// @access private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required')
        .not()
        .isEmpty(),
      check('company', 'company is required')
        .not()
        .isEmpty(),
      check('from', 'from to Date is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      title,
      from,
      to,
      location,
      current,
      description
    } = req.body;

    const newExp = {
      company,
      title,
      from,
      to,
      location,
      current,
      description
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      // unshift is to sort by newer first
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error for add exp');
    }
  }
);

// @Delete  api/profile/experience/:exp_id
// @desc Delete profile experience
// @access private

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    // delete user profile
    const profile = await Profile.findOne({ user: req.user.id });

    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    if (removeIndex == 0) {
      profile.experience.splice(removeIndex, 1);
      await profile.save();
      return res.json(profile);
    } else {
      return res.json(profile);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @Delete  api/profile/education
// @desc add education
// @access private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'school is required')
        .not()
        .isEmpty(),
      check('degree', 'degree is required')
        .not()
        .isEmpty(),
      check('fieldofstudy', 'fieldofstudy is required')
        .not()
        .isEmpty(),
      check('from', 'from to Date is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const addEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      // unshift is to sort by newer first
      profile.education.unshift(addEdu);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error for edu');
    }
  }
);

// @Delete  api/profile/education/:exp_id
// @desc Delete profile education
// @access private

router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    // delete user profile
    const profile = await Profile.findOne({ user: req.user.id });

    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);

    if (removeIndex == 0) {
      profile.education.splice(removeIndex, 1);
      await profile.save();
      return res.json(profile);
    } else {
      return res.json(profile);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
