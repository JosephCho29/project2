const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override"); 
const morgan = require("morgan");
const app = express();

const authController = require('./controllers/auth.js');
const session = require('express-session');

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const Profile = require("./models/profile.js");
const User = require("./models/user.js");

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); 
app.use(morgan("dev"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", async (req, res) => {
  res.render("index.ejs", {
      user: req.session.user,
  });
});

app.use('/auth', authController);

app.get('/profile', async (req, res) => {
  const allProfile = await Profile.find();
  console.log(allProfile);
  res.render('profile/index.ejs', { profile: allProfile });
});

app.post("/profile", async (req, res) => {
  if (req.body.friendlyToStrangers === "on") {
    req.body.friendlyToStrangers = true;
  } else {
    req.body.friendlyToStrangers = false;
  }
  await Profile.create(req.body);
  res.redirect("/profile");
});

app.get('/profile/new', async (req, res) => {
  res.render('profile/new.ejs');
});

app.get("/profile/:profileId", async (req, res) => {
  const foundProfile = await Profile.findById(req.params.profileId);
  res.render("profile/show.ejs", { profile: foundProfile });
});








app.get("/profile/:profileId/edit", async (req, res) => {
  const foundProfile = await Profile.findById(req.params.profileId);
  res.render("profile/edit.ejs", {
    profile: foundProfile,
  })
});

app.get("/profiles/:profileId/edit", async (req, res) => {
  const foundProfile = await Profile.findById(req.params.profileId);
  res.render("profiles/edit.ejs", {
    profile: foundProfile,
  });
});

app.put("/profile/:profileId", async (req, res) => {
  // Handle the 'isReadyToEat' checkbox data
  if (req.body.friendlyToStrangers === "on") {
    req.body.friendlyToStrangers = true;
  } else {
    req.body.friendlyToStrangers = false;
  }
  
  // Update the profile in the database
  await Profile.findByIdAndUpdate(req.params.profileId, req.body);

  // Redirect to the profile's show page to see the updates
  res.redirect(`/profile/${req.params.profileId}`);
});


app.delete("/profile/:profileId", async (req, res) => {
  await Profile.findByIdAndDelete(req.params.profileId);
  res.redirect("/profile");
});


// app.use('/auth', authController);
// app.use('/users/applications', applicationsController);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
