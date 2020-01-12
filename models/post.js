const mongoose = require('mongoose');

const Postschema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  name: {
    type: String
  },
  text: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  likes: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
    }
  ],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
      name: {
        type: String
      },
      text: {
        type: String,
        required: true
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now()
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = Post = mongoose.model('post', Postschema);
