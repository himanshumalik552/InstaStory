const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const dotenv = require("dotenv");
const morgan = require("morgan");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const exphbs = require("express-handlebars");
const connectDB = require("./config/db");

//Load config

dotenv.config({ path: "./config/config.env" });

//Passport config

require("./config/passport")(passport);

connectDB();

const app = express();

//Body parser

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method overriding
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

//Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//HandleBar helpers

const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require("./helpers/hbs");

//Handlebar
app.engine(
  ".hbs",
  exphbs({
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select,
    },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

//Session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

//passport middleware

app.use(passport.initialize());
app.use(passport.session());

// Set global variable

app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

//Router

app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

//Static folder

app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
