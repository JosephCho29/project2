const mongoose = require('mongoose');


const profileSchema = new mongoose.Schema({
  // company: {
  //   type: String,
  //   required: true,
  // },
  // title: {
  //   type: String,
  //   required: true,
  // },
  // notes: {
  //   type: String,
  // },
  // postingLink: {
  //   type: String,
  // },
  // status: {
  //   type: String,
  //   enum: ['interested', 'applied', 'interviewing', 'rejected', 'accepted'],
  // },
  petname: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  breed: {
    type: String,
    required: true,
  },
  likesAndDislikes: {
    type: String,
    required: true,
  },
  friendlyToStrangers: {
    type: Boolean,
    required: true,
  },
});

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profiles: [profileSchema], // embedding the profileSchema here
});

const User = mongoose.model('User', userSchema);

module.exports = User;
