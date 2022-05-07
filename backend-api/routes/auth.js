const express = require("express");
const { signOut, signup, signin, isSignedIn } = require("../controllers/auth");
const { check, validationResult } = require("express-validator");

const router = express.Router();

router.post(
  "/signup",
  [
    check("name", "name should be at least 3 char").isLength({ min: 3 }),
    check("email", "a valid email is required").isEmail(),
    check("password", "password should be at least 3 char").isLength({
      min: 3,
    }),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email", "A valid email is required").isEmail(),
    check("password", "Password is required").isLength({
      min: 3,
    }),
  ],
  signin
);

router.get("/signout", signOut);

router.get("/testroute", isSignedIn, (req, res) => {
  // res.send("A protected route")
  res.json(req.auth);
});

module.exports = router;
