const express = require("express");
const passport = require("passport");
require('dotenv').config();
const cors = require("cors");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const projectRouter = require("./routers/project");
const organisationRouter = require("./routers/organisation");
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const LINKEDIN_KEY = process.env.CLIENT_ID;
const LINKEDIN_SECRET = process.env.CLIENT_SECERT;
passport.use(new LinkedInStrategy({
    clientID: LINKEDIN_KEY,
    clientSecret: LINKEDIN_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/linkedin/callback",
    scope: ['r_emailaddress', 'r_liteprofile'],
  }, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }));

  // app.get(
  //   "/auth/linkedin",
  //   passport.authenticate("linkedin", { state: "SOME STATE" })
  // );

const app = express();
app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.use(organisationRouter);
app.use(projectRouter);

module.exports = app;
