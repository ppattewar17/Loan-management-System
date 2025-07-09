const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  fileNumber: Number,
  clientName: String,
  executive: String,
  bankRM: String,
  product: String,
  loanAmount: String,
  assetType: String,
  tenor: Number,
  roi: Number,
  bankName: String,
  status: String
});

module.exports = mongoose.model("Loan", loanSchema);
