const LocalStrategy = require("passport-local");
const User = require("../models/user.model");
const passport = require("passport");
const { validateUserPassword } = require("../utils/password.utils");

const formDataFields = {
  usernameField: "username",
  passwordField: "password",
};

const localStrategy = new LocalStrategy(formDataFields, async function (
  username,
  password,
  done
) {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      done(null, false);
    }
    const isValidPassword = await validateUserPassword(
      password,
      user.passwordHash,
      user.salt
    );
    if (isValidPassword) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err);
  }
});

passport.use(localStrategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  User.findById(userId)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err);
    });
});
