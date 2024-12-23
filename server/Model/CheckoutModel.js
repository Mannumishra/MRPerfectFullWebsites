const mongoose = require('mongoose');

const checkoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cartItems: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "package",
                required: true
            },
            packageName: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            destination: {
                type: String,
                required: true
            },
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending',
    },
    paymentMethod: {
        type: String,
        default: "Online"
    },
    paymentId: {
        type: String,
        required: false, // Payment ID will be populated after payment
    },
    shippingAddress: {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            default: "India",
        },
        pincode: {
            type: Number,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});


const Checkout = mongoose.model('Checkout', checkoutSchema);
module.exports = Checkout
