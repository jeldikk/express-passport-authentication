const express = require("express");
const User = require("../models/user.model");
const { generateSalt, createPasswordHash } = require("../utils/password.utils");
const passport = require("passport");
const authRouter = express.Router();

authRouter
  .route("/register")
  .get((req, res) => {
    const registerForm = `
        <h1>Register Form</h1>\
        <form method="POST" action="/auth/register">
            <div class="form-control">
                <label>Username</label>
                <input type="text" name="username" />
            </div>
            <div class="form-control">
                <label>Email</label>
                <input type="email" name="email" />
            </div>
            <div class="form-control">
                <label>Password</label>
                <input type="password" name="password" />
            </div>
            <button type="submit">Register</button>
        </form>
    `;
    res.send(registerForm);
  })
  .post(async (req, res) => {
    // get username and password from req.body
    // we have to even check if session cookie is properly sent in req.session
    console.log("you are about to register a user");
    const { username, password } = req.body;
    const salt = generateSalt(32);
    const passwordHash = await createPasswordHash(password, salt);
    await User.create({ username, salt, passwordHash });
    res.redirect("/auth/success");
  });

authRouter
  .route("/login")
  .get((req, res) => {
    const loginForm = `
        <h1>Login Page</h1>\
        <form method="POST" action="/auth/login">\
            <div class="form-control">
                <label>Enter Username :</label>
                <input type="text" name="username" />
            </div>
            <div class="form-control">
                <label>Enter Password :</label>
                <input type="password" name="password" />
            </div>
            <button type="submit">Login</button>
        </form>
    `;
    res.send(loginForm);
  })
  .post(passport.authenticate("local"), (req, res) => {
    console.log("You are about to login the authenticate user");
    res.cookie("access_token", "access-token-of-user", {
      sameSite: "strict",
      secure: true,
      signed: true,
      maxAge: 1 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.cookie("user_id", "user-id-of-the-user", {
      sameSite: "strict",
      secure: true,
      signed: true,
      maxAge: 1 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.redirect("/");
  });

authRouter.route("/logout").get((req, res) => {
  console.log("I am calling from logout callback");
  req.logout((err) => {
    res.clearCookie("access_token");
    res.clearCookie("user_id");
    res.redirect("/");
  });
});

authRouter.get("/success", (req, res) => {
  const successHtml = `
        <h1>Logged in Successfully</h1>
    `;
  res.send(successHtml);
});

authRouter.get("/failure", (req, res) => {
  const failureHtml = `
        <h1>Logged In Failed</h1>
    `;

  res.send(failureHtml);
});

authRouter.get("/unauthorised", (req, res) => {
  const unauthorisedHtml = `
    <h1>You are not properly Authorized</h1>
  `;
  res.send(unauthorisedHtml);
});

authRouter.get("/protected-route", (req, res) => {
  if (req.isAuthorised()) {
    res.send(`
      <h1> You are Authorised </h1>
      <a href="/auth/logout">
        <button type="button">Logout</button>
      </a>
    `);
  } else {
    res.send(`
      <h1>You are not Authorised</h1>
      <a href="/auth/login">
        <button type="button">Login</button>
      </a>
    `);
  }
});

module.exports = authRouter;
