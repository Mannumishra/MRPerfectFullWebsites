const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PackageInquirySchema = new Schema({
  packageCity: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Successful', 'Failed'],
  },
  razorpay_order_id: {  // Make this field optional
    type: String,
    required: false, // Optional initially
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});



const PackageInquery = mongoose.model('PackageInquiry', PackageInquirySchema);

module.exports = PackageInquery
