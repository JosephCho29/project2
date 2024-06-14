const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

// we will build out our router logic here

router.get('/', async (req, res) => {
  try {
    // Look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    // console.log(currentUser.profiles)
    // Render index.ejs, passing in all of the current user's 
    // profiles as data in the context object. 
    if (!!currentUser) {
      return res.render('profiles/index.ejs', {
        profiles: currentUser.profiles,
        users: currentUser.users,
      });
    }

    res.redirect('/')

  } catch (error) {
    // If any errors, log them and redirect back home
    console.log(error)
    res.redirect('/')
  }
});

router.post('/', async (req, res) => {
  try {
    // Look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    // Push req.body (the new form data object) to the
    // profiles array of the current user
    currentUser.profiles.push(req.body);
    // Save changes to the user
    await currentUser.save();
    // Redirect back to the profiles index view
    res.redirect(`/users/${currentUser._id}/profiles`);
  } catch (error) {
    // If any errors, log them and redirect back home
    console.log(error);
    res.redirect('/')
  }
});

// controllers/profiles.js

router.get('/:profileId', async (req, res) => {
  try {
    // Look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    // Find the profile by the profileId supplied from req.params
    const profile = currentUser.profiles.id(req.params.profileId);
    // Render the show view, passing the profile data in the context object
    res.render('profiles/show.ejs', {
      profile: profile,
    });
  } catch (error) {
    // If any errors, log them and redirect back home
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
    // Find the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    // Find the current profile from the id supplied by req.params
    const profile = currentUser.profiles.id(req.params.profileId);
    console.log(req.body.friendlyToStrangers);
    // Use the Mongoose .set() method, updating the current profile to reflect the new form data on `req.body`
    profile.set(req.body);
    // Save the current user
    await currentUser.save();
    // Redirect back to the show view of the current profile
    // console.log("Params", req.params)
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
    // Look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    // Use the Mongoose .deleteOne() method to delete 
    // an profile using the id supplied from req.params
    currentUser.profiles.id(req.params.profileId).deleteOne();
    // Save changes to the user
    await currentUser.save();
    // Redirect back to the profiles index view
    res.redirect(`/users/${currentUser._id}/profiles`);
  } catch (error) {
    // If any errors, log them and redirect back home
    console.log(error);
    res.redirect('/')
  }
});

module.exports = router;