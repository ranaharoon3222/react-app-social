const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
/// ...rest of the initial code omitted for simplicity.
const { check, validationResult } = require('express-validator');

// Get ROute api/
// main Route
// Public route

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
// Post ROute api/
// login authentication
// Public route
router.post(
  '/',
  [
    check('email', 'email address is required').isEmail(),
    check('password', 'Please is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      /// See if user exist
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          errors: [{ msg: 'Invalid credentials' }]
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      /// match the user credentials
      if (!isMatch) {
        return res.status(400).json({
          errors: [{ msg: 'Invalid credentials' }]
        });
      }

      /// Return json Web token
      const payload = {
        user: {
          id: user.id
        }
      };
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

      /// handle error
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
