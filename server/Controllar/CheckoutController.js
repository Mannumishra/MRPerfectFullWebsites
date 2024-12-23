const Razorpay = require('razorpay');
const crypto = require('crypto');
const Checkout = require('../Model/CheckoutModel');
const { error } = require('console');

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createCheckout = async (req, res) => {
    console.log(req.body);
    try {
        const { userId, cartItems, shippingAddress } = req.body;

        // Calculate the total amount properly
        const totalAmount = cartItems.reduce((total, item) => total + item.price, 0);

        // Save checkout details in the database
        const checkout = new Checkout({
            userId,
            cartItems,
            totalAmount,
            shippingAddress,
            paymentStatus: 'Pending',
        });

        await checkout.save();

        // Create Razorpay order
        const razorpayOrder = await razorpayInstance.orders.create({
            amount: totalAmount * 100, // Razorpay amount is in paise
            currency: 'INR',
            receipt: `receipt_${checkout._id}`,
            payment_capture: 1,
        });

        console.log("Razorpay Order Details:", razorpayOrder); // Log to verify the amount

        // Send the correct response back to frontend
        res.status(200).json({
            success: true,
            checkoutId: checkout._id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong while creating checkout' });
    }
};


exports.verifyPayment = async (req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature, checkoutId } = req.body;
        console.log(req.body)

        const body = razorpayOrderId + "|" + razorpayPaymentId;
        const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpaySignature) {
            const data = await Checkout.findOne({ _id: checkoutId })
            console.log(data)
            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: "Checkout Id Not Found"
                })
            }
            data.paymentStatus = "Paid"
            await data.save()
            return res.status(200).json({
                success: true,
                message: "Payment Verifysuccessfully"
            })
        } else {
            res.status(400).json({ error: 'Payment verification failed' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong while verifying payment' });
    }
};
