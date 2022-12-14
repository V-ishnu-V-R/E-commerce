var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
const dotenv = require("dotenv");
var hbs = require("express-handlebars");
var session = require("express-session");
const multer = require("multer");
const Handlebars = require("handlebars");

dotenv.config();
// mongoose connection to the atlas
mongoose
  .connect(process.env.MONGO_URL, {
    useNewurlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("db connextion success");
  })
  .catch((err) => {
    console.log(err);
  });

var adminRouter = require("./routes/admin");
var usersRouter = require("./routes/users");
const { helpers } = require("handlebars");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  hbs.engine({
    helpers: {
      inc: function (value, options) {
        return parseInt(value) + 1;
      },
      formatString(date){
        newdate=date.toUTCString()
        return newdate.slice(0,17)
      },
      total: function (sellingPrice, quantity) {
        return sellingPrice * quantity;
      },
    },
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layout/",
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
const oneDay = 1000 * 60 * 60 * 24;
app.use(
  session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);
app.use(function (req, res, next) {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});

app.use("/admin", adminRouter);
app.use("/", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  //next(createError(404));
  res.render("users/error");
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("users/error");
});

module.exports = app;

// $.ajax({
//   url: "/changeUsername",
//   data: {
//     userId: userId,
//     fname: name,
//   },
//   method: "patch",
//   success: (response) => {
//     if (response) {
//       // swal("Deleted Successflly");
//       location.reload();
//     }
//   },
//   error: (error) => {
//   },
// });
 

