const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");

const app = express();

const conn = require("./db/conn");

//models
const User = require("./models/User");
const Task = require("./models/Task");

//routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

// controller
const TaskController = require("./controllers/TaskController");

// config handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

// config body

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// session
app.use(
  session({
    name: "session",
    secret: "nosso_secret",
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require("path").join(require("os").tmpdir(), "sessions"),
    }),
    cookie: {
      secure: false,
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    },
  })
);

// flash message
app.use(flash());

// config statics
app.use(express.static("public"));

app.use((req, res, next) => {
  // console.log(req.session)

  if (req.session.userid) {
    res.locals.session = req.session;
  }

  next();
});

app.use("/tasks", taskRoutes);
app.use("/", authRoutes);
app.get("/", login, TaskController.showTasks);

function login(req, res, next) {
  if (req.session.userid) {
    next();
  } else {
    res.redirect("/login");
  }
}

conn
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
