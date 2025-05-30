require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const Database_Connection = require("./config/db");
const userRoute = require("./routes/user");
const cartRoute = require("./routes/cart");
const productRoute = require("./routes/product");
const categoryRoute = require("./routes/categories");
const sliderRoute = require("./routes/slider");
const dealsRoute = require("./routes/deals");
const addressRoute = require("./routes/address");
const paymentRoute = require("./routes/payment");
const orderRoute = require("./routes/orders");

const server = express();
server.use(express.json());
server.use(cors({ origin: "*" }));
server.use(helmet());

server.use("/user", userRoute);
server.use("/cart", cartRoute);
server.use("/product", productRoute);
server.use("/category", categoryRoute);
server.use("/slider", sliderRoute);
server.use("/deal", dealsRoute);
server.use("/address", addressRoute);
server.use("/payment", paymentRoute);
server.use("/order", orderRoute);

const PORT = process.env.PORT || 3000;

server.get("/", (req, res) => {
  res.json({
    message: "server tested successfully",
  });
});

server.listen(PORT, () => {
  Database_Connection();
  console.log(`server is live on http://localhost:${PORT}`);
});
