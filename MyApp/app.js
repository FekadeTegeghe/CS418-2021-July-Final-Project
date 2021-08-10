var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const MongoClient = require("mongodb").MongoClient;

const JWTManager = require("./jwt");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const productsRouter = require("./routes/products");
const reviewRouter = require("./routes/review");

var app = express();

// view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "jade");

//app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, "public")));

let conn;
app.use((req, res, next) => {
  if (!conn) {
    console.log("connecting ...");
    MongoClient.connect(
      "mongodb+srv://fekade:123@cluster0.0l2zb.mongodb.net/cs418?retryWrites=true&w=majority",
      { useUnifiedTopology: true }
    )
      .then((client) => {
        conn = client.db("cs418");
        req.db = conn;
        next();
      })
      .catch((err) => console.log("Error: ", err));
  } else {
    req.db = conn;
    next();
  }
});

app.use("/", (req, res, next) => {
  if (req.url === "/signin") {
    next();
    return;
  }
  const header = req.headers.authorization; //Bearer token

  if (!header) {
    return res.json({ status: "auth_error" });
  } else {
    const data = JWTManager.verify(header.split(" ")[1]);
    console.log(data);
    if (!data) {
      return res.json({ status: "auth_error" });
    }
    if (req.method == "DELETE" || req.method == "UPDATE") {
      if (data.role == "superUser") {
        next();
      } else {
        res.status(401).send("Error: Access Denied");
      }
    } else {
      next();
    }
  }
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/signin", authRouter);
app.use("/", productsRouter);
app.use("/", reviewRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(3000);
