const User = require("../models/user");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const {expressjwt} = require("express-jwt");

exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array().map((e) => e.msg),
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "not able to save user in DB",
      });
    } else {
      res.json({
        name: user.name,
        email: user.email,
        id: user._id,
      });
    }
  });
  // res.json({ message: "User signup successful 1" });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array().map((e) => e.msg),
    });
  }
  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: "User does not exist." });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({ error: "Password is incorrect" });
    }

    // create the token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);

    // put it into cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    // send response to frontend
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signOut = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "User SignOut successful" });
};

// protected routes
exports.isSignedIn = expressjwt({
    secret: process.env.SECRET,
    algorithms: ["HS256"],
    userProperty: "auth"
  });

//custom middlewares
exports.isAuthenticated = (req,res,next)=>{
    let checker = req.profile && req.auth && req.profile._id == req.auth._id
    if(!checker){
        return res.status(403).json({error:"ACCESS DENIED"})
    }
    next()
}

exports.isAdmin = (req,res,next)=>{
    if(req.profile.role === 0){
        return res.status(403).json({error:"You dont have admin access"})
    }
    
    next()
}
