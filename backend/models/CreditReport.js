const mongoose = require('mongoose');

const creditAccountSchema = new mongoose.Schema({
  bank: String,
  accountNumber: String,
  accountType: String,
  portfolioType: String,
  currentBalance: Number,
  amountOverdue: Number,
  accountStatus: String,
  openDate: String,
  closedDate: String,
  creditLimit: Number,
  address: String,
});

const creditReportSchema = new mongoose.Schema(
  {
    reportNumber: {
      type: String,
      required: true,
      unique: true,
    },
    basicDetails: {
      name: String,
      mobilePhone: String,
      pan: String,
      creditScore: Number,
    },
    reportSummary: {
      totalAccounts: Number,
      activeAccounts: Number,
      closedAccounts: Number,
      currentBalance: Number,
      securedAmount: Number,
      unsecuredAmount: Number,
      last7DaysEnquiries: Number,
    },
    creditAccounts: [creditAccountSchema],
    reportDate: String,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CreditReport', creditReportSchema);