const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { sortBy } = require("lodash");

exports.getProductById = (req, res, next, id) => {
  //
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({ error: "product not found" });
      }

      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({ error: "problem with image" });
    }

    // destructure the fields
    const { name, description, price, category, stock } = fields;

    // restriction
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({ error: "Please Include all fields" });
    }

    let product = new Product(fields);
    console.log(product);

    // handle file here
    if (file.photo) {
      if (file.photo.size > 1024 * 1024 * 3) {
        return res
          .status(400)
          .json({ error: "file size too big, should be less than 2 Mb" });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;

      //save to db
      product.save((err, product) => {
        if (err) {
          res.status(400).json({ error: "saving photo in db failed" });
        }
        res.json(product);
      });
    }
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
};

exports.updateProduct = (req, res) => {
  let product;
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({ error: "problem with image" });
    }

    //updation code
    let product = req.product;
    product = _.extend(product, fields);

    // handle file here
    if (file.photo) {
      if (file.photo.size > 1024 * 1024 * 3) {
        return res
          .status(400)
          .json({ error: "file size too big, should be less than 2 Mb" });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;

      //save to db
      product.save((err, product) => {
        if (err) {
          res.status(400).json({ error: "Updation of product failed" });
        }
        res.json(product);
      });
    }
  });
};

exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({ error: "failed to delete the product" });
    }
    res.json({
      message: `Deleted the product`,
      deletedProduct,
    });
  });
};

exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({ error: "No products found" });
      }
    });
};

exports.getAllUniqueCategories = (req,res)=>{
  Product.distinct("categories",{},(err,category)=>{
    if(err){
      return res.status(400).json({
        error:"NO Category Found"
      })
      
    }
    res.json(category)
  })
}

exports.updateStock = (req, res, next) => {
  let ops = req.body.order.products.map((p) => {
    return {
      updateOne: {
        filter: { _id: p._id },
        update: { $inc: { stock: -p.count, sold: +p.count } },
      },
    };
  });

  Product.bulkWrite(ops, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk Operation failed",
      });
    }
    next();
  });
};
