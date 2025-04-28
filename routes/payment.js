const express = require("express");
const paymentModel = require("../models/payment");
const axios = require("axios");
const crypto = require("crypto");
const orderModel = require("../models/order");
const cartModel = require("../models/cart");
const AuthMiddleware = require("../middlewares/auth");
const route = express.Router();

const MERCHANT_KEY = "96434309-7796-489d-8924-ab56988a6076";
const MERCHANT_ID = "PGTESTPAYUAT86";

const MERCHANT_BASE_URL =
  "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
const MERCHANT_STATUS_URL =
  "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status";

const redirectUrl = `http://localhost:8080/status`;

const successUrl = "http://localhost:5173/payment-success";
const failureUrl = "http://localhost:5173/payment-failure";

route.post("/create-order", AuthMiddleware, async (req, res) => {
  const { amount } = req.body;
  const orderId = "TXN_" + Date.now();

  const paymentPayload = {
    merchantId: MERCHANT_ID,
    amount: amount * 100,
    merchantTransactionId: orderId,
    redirectUrl: `${redirectUrl}/?id=${orderId}`,
    redirectMode: "GET",
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
  const string = payload + "/pg/v1/pay" + MERCHANT_KEY;
  const sha256 = crypto.createHash("sha256").update(string).digest("hex");
  const checksum = sha256 + "###" + keyIndex;

  const option = {
    method: "POST",
    url: MERCHANT_BASE_URL,
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
    `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + MERCHANT_KEY;
  const sha256 = crypto.createHash("sha256").update(string).digest("hex");
  const checksum = sha256 + "###" + keyIndex;

  const option = {
    method: "GET",
    url: `${MERCHANT_STATUS_URL}/${MERCHANT_ID}/${merchantTransactionId}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": MERCHANT_ID,
    },
  };

  axios.request(option).then((response) => {
    if (response.data.success === true) {
      console.log("success..............")
      return res.redirect(successUrl);
    } else {
      return res.redirect(failureUrl);
    }
  });
});

module.exports = route;
