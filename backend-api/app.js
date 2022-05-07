require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

//My routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");

//connect to database
mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch(() => {
    console.log("OOps connection to DB failed");
  });

const port = process.env.PORT || 9000;

//setup middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// My Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);

// start the server
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
