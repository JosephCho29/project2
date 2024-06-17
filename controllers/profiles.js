const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

router.get('/', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    if (!!currentUser) {
      return res.render('profiles/index.ejs', {
        profiles: currentUser.profiles,
        users: currentUser.users,
      });
    }

    res.redirect('/')

  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
});

router.post('/', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    currentUser.profiles.push(req.body);
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/profiles`);
  } catch (error) {
    console.log(error);
    res.redirect('/')
  }
});

router.get('/:profileId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const profile = currentUser.profiles.id(req.params.profileId);
    res.render('profiles/show.ejs', {
      profile: profile,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/')
  }
});

router.get('/:profileId/edit', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const profile = currentUser.profiles.id(req.params.profileId);
    console.log(profile);
    res.render('profiles/edit.ejs', {
      profile: profile,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/')
  }
});

router.put('/:profileId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const profile = currentUser.profiles.id(req.params.profileId);
    console.log(req.body.friendlyToStrangers);
    profile.set(req.body);
    await currentUser.save();
    res.redirect(
      `/users/${currentUser._id}/profiles/${req.params.profileId}`
    );
  } catch (error) {
    console.log(error);
    res.redirect('/')
  }
});

router.delete('/:profileId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    currentUser.profiles.id(req.params.profileId).deleteOne();
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/profiles`);
  } catch (error) {
    console.log(error);
    res.redirect('/')
  }
});

module.exports = router;