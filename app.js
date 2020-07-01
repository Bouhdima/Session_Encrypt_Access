//jshint esversion:6
require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const ejs = require("ejs");
// const encrypt = require("mongoose-encryption");
const  md5=require("md5");
const mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

//////Url database connect//////

const url = "mongodb://localhost:27017/userDB";
mongoose.connect(url);

const userSchema = new mongoose.Schema({ //new mongoose.schema added for encryption
  email: String,
  password: String
});
const secret=process.env.SECRET;
// userSchema.plugin(encrypt, {
//   secret: secret,
//   encryptedFields: ["password"]
// });


const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("Home");
});
app.get("/login", function(req, res) {
  res.render("login");
});
app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password)
  });
  newUser.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});
app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = md5(req.body.password);
  User.findOne({
      email: username
    },
    function(err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          if (foundUser.password === password) {
            res.render("secrets");
          }
        }
      }
    });
});








app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
