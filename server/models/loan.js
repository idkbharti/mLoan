const mongoose = require('mongoose');

// Define the Loan Schema
const loanSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  tenureInWeeks: {
    type: Number,
    required: true,

  },
  completedTenure: {
    type: Number,
    required: true,
    default:0,
  },
  userAction: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'REJECTED',],
    default: 'PENDING',
  },
  panCard: {
    type: String,
    required: true,
  },
  lastPayment:{
    type: String,
    default:"NIL"
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'PAID'],
    default: 'PENDING',
  },
});

module.exports = mongoose.model('Loan', loanSchema);
