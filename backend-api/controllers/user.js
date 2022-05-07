const User = require("../models/user");
const Order = require("../models/order");

// middleware
exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  // TODO: get back here for password
  req.profile.encry_password = undefined;
  req.profile.salt = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;

  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err || !user) {
        return res.status(400).json({ error: "User info update failed" });
      }
      user.encry_password = undefined;
      user.salt = undefined;

      res.json(user);
    }
  );
};

exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({ error: "user have no past purchases" });
      }

      return res.json(orders);
    });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];
  req.body.order.products.forEach((product) => {
    const { _id, name, description, category, quantity } = product;
    purchases.push({
      _id,
      name,
      description,
      category,
      quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });

  //store it in DB
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    {new:true},
    (err,purchases)=>{
        if(err){
            return res.status(400).json({error:"unable to save purchase list"})
        }
        next();
    }
  );

  
};

// todo remove this
exports.getAllUsers = (req, res) => {
  User.find().exec((err, users) => {
    if (err || !users) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    return res.json(
      users.map((u) => ({
        email: u.email,
        name: u.name,
        id: u._id,
      }))
    );
  });
};
