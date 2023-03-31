require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const PORT = 3000;
const db = require("./config/mongoose");
const ejs = require("ejs");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const Message = require('./models/message');
const User = require('./models/user');

const app = express();



app.use(expressLayouts);

//used for session cookie
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const MongoStore = require("connect-mongo");

//middlewares
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));



//assets
app.use(express.static(path.join(__dirname, "assets")));

//ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));




//mongo store is used to store the session in cookie in db
app.use(
  session({
    name: "ChatApp",
    secret: "viratkohli123",
    saveUninitialized: true,
    resave: true,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/ChatApp",
      autoRemove: "disabled",
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(passport.checkAuthentication);

//socket io
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});


io.on('connection', function(socket){
  console.log('User Conncetion');

  socket.on('chat message', function(msg, user){
    console.log(user);
    console.log("Message " + msg['message'] + user);
    io.emit('chat message', msg);
  });
});

http.listen(8000, function() {
  console.log('Node app is running on port', 8000);
});


//routes
app.use("/", require("./routes/index"));


//listening server on port
app.listen(PORT, function (err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`server running on port ${PORT}`);
});

