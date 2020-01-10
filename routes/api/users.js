const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
/// ...rest of the initial code omitted for simplicity.
const { check, validationResult } = require('express-validator');

/// Post Route api/
/// Register User
/// Public route

router.post(
  '/',
  [
    check('name', 'Name is Required')
      .not()
      .isEmpty(),
    check('email', 'A valid email address is required').isEmail(),
    check(
      'password',
      'Please Enter a Password with Minium of 3 characters'
    ).isLength({ min: 3 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      /// See if user exist
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          errors: [{ msg: 'User already exist please try another one' }]
        });
      }
      /// Get User Gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      /// Encrypt Password
      user = new User({
        name,
        email,
        avatar,
        password
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

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
