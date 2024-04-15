const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const https = require("https");
const fs = require("fs");
const cookieParser = require("cookie-parser");

const PORT = 3000;

const { MONGODB_URL } = require("./config/database");
const authRouter = require("./routes/auth.routes");
const passport = require("passport");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "my-super-duper-session-secret",
    name: "session.id",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: MONGODB_URL,
    }),
    cookie: {
      maxAge: 1 * 60 * 60 * 1000,
      sameSite: true,
      secure: true,
    },
  })
);

app.use(cookieParser("MY SECRET"));

require("./config/passport");

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send(`
        <h1>Express Authentication thing is here</h1>
        <nav>
            <ul>
                <li>
                  <a href="/auth/register">Register</a>
                </li>
            </ul>
        </nav>
        <main>
          ${
            req.isAuthenticated()
              ? `
              <h1>You are Authenticated</h1>
              <a href="/auth/logout">Logout</a>
            `
              : `
              <h1>You are Not Authenticated</h1>
              <a href="/auth/login">Login</a>
            `
          }
        </main>
    `);
});

let server = app;

const key = fs.readFileSync("./certificates/localhost.decrypted.key");
const cert = fs.readFileSync("./certificates/localhost.crt");
server = https.createServer({ key, cert }, app);
server.listen(PORT, () => {
  console.log(`Listening Server on port ${PORT}`);
});
