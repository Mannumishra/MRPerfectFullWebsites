const { createCheckout, verifyPayment } = require("../Controllar/CheckoutController")

const CheckoutRouter = require("express").Router()

CheckoutRouter.post("/checkout", createCheckout)
CheckoutRouter.post("/verify-payment", verifyPayment)

module.exports = CheckoutRouter