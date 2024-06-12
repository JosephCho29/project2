// controllers/profile.js

const express = require('express');
const router = express.Router();
//Router is the submodule//
const User = require('../models/user.js');

// we will build out our router logic here

// controllers/profile.js

router.get('/', async (req, res) => {
    try {
      // Look up the user from req.session
      const currentUser = await User.findById(req.session.user._id);
      // Render index.ejs, passing in all of the current user's 
      // profile as data in the context object. 
      res.render('profile/index.ejs', {
        profile: currentUser.profile,
      });
    } catch (error) {
      // If any errors, log them and redirect back home
      console.log(error)
      res.redirect('/')
    }
  });
  

router.get('/new', async (req, res) => {
    res.render('profile/new.ejs');
});

router.post('/', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        currentUser.profile.push(req.body);
        await currentUser.save();
        res.redirect(`/users/${currentUser._id}/profile`);
    }   catch (error) {
        console.log(error);
        res.redirect('/');
    }
})

router.get('/:profileId', async (req, res) => {
    try {
      // Look up the user from req.session
      const currentUser = await User.findById(req.session.user._id);
      // Find the profile by the profileId supplied from req.params
      const profile = currentUser.profile.id(req.params.profileId);
      // Render the show view, passing the profile data in the context object
      res.render('profile/show.ejs', {
        profile: profile,
      });
    } catch (error) {
      // If any errors, log them and redirect back home
      console.log(error);
      res.redirect('/')
    }
});

router.delete('/:profileId', async (req, res) => {
    try {
      const currentUser = await User.findById(req.session.user._id);
      currentUser.profile.id(req.params.profileId).deleteOne();
      await currentUser.save();
      res.redirect(`/users/${currentUser._id}/profile`);
    } catch (error) {
      console.log(error);
      res.redirect('/')
    }
});

// controllers/profile.js
router.get('/:profileId/edit', async (req, res) => {
    try {
      const currentUser = await User.findById(req.session.user._id);
      const profile = currentUser.profile.id(req.params.profileId);
      res.render('profile/edit.ejs', {
        profile: profile,
      });
    } catch (error) {
      console.log(error);
      res.redirect('/')
    }
  });

  // // controllers/profile.js`

router.put('/:profileId', async (req, res) => {
    try {
      // Find the user from req.session
      const currentUser = await User.findById(req.session.user._id);
      // Find the current profile from the id supplied by req.params
      const profile = currentUser.profile.id(req.params.profileId);
      // Use the Mongoose .set() method, updating the current profile to reflect the new form data on `req.body`
      profile.set(req.body);
      // Save the current user
      await currentUser.save();
      // Redirect back to the show view of the current profile
      res.redirect(
        `/users/${currentUser._id}/profile/${req.params.profileId}`
      );
    } catch (error) {
      console.log(error);
      res.redirect('/')
    }
  });
  
  
module.exports = router;