const express = require("express");
const paymentModel = require("../models/payment");
const axios = require("axios");
const crypto = require("crypto");
const orderModel = require("../models/order");
const cartModel = require("../models/cart");
const AuthMiddleware = require("../middlewares/auth");
const route = express.Router();

route.post("/create-order", AuthMiddleware, async (req, res) => {
  const { amount } = req.body;
  const orderId = "TXN_" + Date.now();

  const paymentPayload = {
    merchantId: process.env.MERCHANT_ID,
    amount: amount * 100,
    merchantTransactionId: orderId,
    redirectUrl: `${process.env.REDIRECT_URL}/?id=${orderId}`,
    redirectMode: "POST",
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };
  const userCartId = await cartModel.findOne({ user: req.id });
  const newPayment = new paymentModel({
    transaction_id: orderId,
  });
  await newPayment.save();
  const newOrder = new orderModel({
    user: req.id,
    transaction_id: newPayment._id,
    amount,
    total_items: userCartId._id,
  });
  await newOrder.save();

  const payload = Buffer.from(JSON.stringify(paymentPayload)).toString(
    "base64"
  );
  const keyIndex = 1;
  const string = payload + "/pg/v1/pay" + process.env.MERCHANT_KEY;
  const sha256 = crypto.createHash("sha256").update(string).digest("hex");
  const checksum = sha256 + "###" + keyIndex;

  const option = {
    method: "POST",
    url: process.env.MERCHANT_BASE_URL,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
    },
    data: {
      request: payload,
    },
  };
  try {
    const response = await axios.request(option);
    res.status(200).json({
      msg: "OK",
      url: response.data.data.instrumentResponse.redirectInfo.url,
    });
  } catch (error) {
    console.log("error in payment", error);
    res.status(500).json({ error: "Failed to initiate payment" });
  }
});

route.post("/status", AuthMiddleware, async (req, res) => {
  const merchantTransactionId = req.query.id;

  const keyIndex = 1;
  const string =
    `/pg/v1/status/${process.env.MERCHANT_ID}/${merchantTransactionId}` +
    process.env.MERCHANT_KEY;
  const sha256 = crypto.createHash("sha256").update(string).digest("hex");
  const checksum = sha256 + "###" + keyIndex;

  const option = {
    method: "GET",
    url: `${process.env.MERCHANT_STATUS_URL}/${process.env.MERCHANT_ID}/${merchantTransactionId}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": process.env.MERCHANT_ID,
    },
  };

  axios.request(option).then((response) => {
    if (response.data.success === true) {
      return res.redirect(process.env.SUCCESS_URL);
    } else {
      return res.redirect(process.env.FAILURE_URL);
    }
  });
});

module.exports = route;
