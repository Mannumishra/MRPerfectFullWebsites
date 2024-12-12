const PackageInquiry = require('../Model/PackageQueryModel');
const axios = require('axios'); // For Hooda Pay
const Razorpay = require('razorpay'); // For Razorpay
const crypto = require('crypto');
require('dotenv').config();

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createInquiry = async (req, res) => {
    try {
        const { packageCity, name, email, phone, address, amount } = req.body;
        const errorMessage = [];

        // Validate the incoming data
        if (!packageCity) errorMessage.push("Package City is required");
        if (!name) errorMessage.push("Name is required");
        if (!email) errorMessage.push("Email is required");
        if (!phone) errorMessage.push("Phone number is required");
        if (!address) errorMessage.push("Address is required");
        if (!amount || amount <= 0) errorMessage.push("Valid amount is required");

        if (errorMessage.length > 0) {
            return res.status(401).json({
                success: false,
                message: errorMessage.join(", "),
            });
        }

        // Create a new inquiry with the received data
        const newInquiry = new PackageInquiry({
            packageCity,
            name,
            email,
            phone,
            address,
            amount,
            paymentStatus: 'Pending', // Set default payment status to 'Pending'
        });

        // Save the inquiry to the database
        const savedInquiry = await newInquiry.save();

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: amount * 100,  // Convert to paise
            currency: 'INR',
            receipt: `receipt_${savedInquiry._id}`,
            payment_capture: 1,
        });

        // Save razorpay_order_id to the inquiry document
        savedInquiry.razorpay_order_id = razorpayOrder.id;  // Add the Razorpay order ID
        await savedInquiry.save();  // Update the saved inquiry with razorpay_order_id

        // Send the orderId back to the frontend
        const { id: orderId } = razorpayOrder;
        res.status(200).json({
            success: true,
            message: "Inquiry created and payment initiated",
            data: {
                inquiry: savedInquiry,
                orderId: orderId,
                key_id: process.env.RAZORPAY_KEY_ID,
                amount: amount,
                currency: 'INR',
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};




// Get All Inquiries
exports.getInquiries = async (req, res) => {
    try {
        const inquiries = await PackageInquiry.find();
        res.status(200).json({
            success: true,
            data: inquiries
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get All Inquiries
exports.deleteInquiries = async (req, res) => {
    try {
        const inquiries = await PackageInquiry.findById(req.params.id);
        if (!inquiries) {
            return res.status(404).json({
                success: false,
                message: "Record not found"
            })
        }
        await inquiries.deleteOne()
        res.status(200).json({
            success: true,
            data: inquiries
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Backend - verifyPayment method
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

        // Verify the payment signature using Razorpay's library
        const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generated_signature === razorpay_signature) {
            // Payment signature matched, update the inquiry status
            const inquiry = await PackageInquiry.findOne({ razorpay_order_id });

            if (inquiry) {
                inquiry.paymentStatus = 'Successful';
                await inquiry.save();
            }

            return res.status(200).json({
                success: true,
                message: 'Payment verification successful',
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed',
            });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};





