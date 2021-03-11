//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();


app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb+srv://admin-bt:Test123@cluster0.vejpu.mongodb.net/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema ({
  fName: String,
  lName: String,
  email: String,
  password: String,
  confirmP: String
});

const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password', 'confirmP']});

const User = new mongoose.model("User", userSchema);

////////////////// CREATING ROUTES //////////////////
app.get("/", function(req, res) {
  res.render("home");
})
app.get("/ourStory", function(req, res) {
  res.render("ourStory");
})
app.get("/login", function(req, res) {
  res.render("login");
})
app.get("/signup", function(req, res) {
  res.render("signup");
})
app.get("/contactUs", function(req, res) {
  res.render("contactUs");
})


////////////////// NEW USERS //////////////////
app.post("/signup", function(req, res) {
  const newUser = new User({
    fName: req.body.name1,
    lName: req.body.name2,
    email: req.body.email,
    password: req.body.pass,
    confirmP: req.body.Cpass
  });

  newUser.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.render("home");
    }
  });
});


////////////////// CONTINUOUS USERS //////////////////
app.post("/login", function(req, res){
  const username = req.body.email;
  const password = req.body.pass;

  User.findOne({email: username}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser){
        if (foundUser.pass === password){
          res.render("home");
        }
      }
    }
  });
});





////////////// LOCALHOST //////////////
const port = process.env.port || 3000;
app.listen(port, () => console.log('listening to port 3000'));
