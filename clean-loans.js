const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/CapitalAssist';

mongoose.connect(uri)
  .then(() => {
    console.log(" Connected to MongoDB");
    cleanLoans();
  })
  .catch(err => {
    console.error("Connection error:", err);
  });

const loanSchema = new mongoose.Schema({}, { strict: false });
const Loan = mongoose.model('Loan', loanSchema);

async function cleanLoans() {
  try {
    const loans = await Loan.find({
      $or: [
        { "FILE NO": { $exists: true } },
        { "CLIENT NAME": { $exists: true } }
      ]
    });

    for (let loan of loans) {
      const updates = {};

      if (loan["FILE NO"]) updates.fileNumber = loan["FILE NO"];
      if (loan["CLIENT NAME"]) updates.clientName = loan["CLIENT NAME"];
      if (loan["CONTACT NO"]) updates.contactNo = loan["CONTACT NO"];
      if (loan["EXECUTIVE"]) updates.executive = loan["EXECUTIVE"].trim();
      if (loan["BANK RM"]) updates.bankRM = loan["BANK RM"].trim();
      if (loan["PROD"]) updates.product = loan["PROD"].trim();

      const rawAmount = loan[" LOAN AMOUNT "];
      if (rawAmount !== undefined) {
        if (typeof rawAmount === 'string') {
          updates.loanAmount = Number(rawAmount.replace(/,/g, ''));
        } else {
          updates.loanAmount = Number(rawAmount);
        }
      }

      if (loan["ASSET TYPE"]) updates.assetType = loan["ASSET TYPE"].trim();
      if (loan["TENOR"]) updates.tenor = loan["TENOR"];
      if (loan["ROI"]) updates.roi = loan["ROI"];
      if (loan["BANK"]) updates.bankName = loan["BANK"].trim();
      if (loan["STATUS"]) updates.status = loan["STATUS"].trim();

      await Loan.updateOne(
        { _id: loan._id },
        {
          $set: updates,
          $unset: {
            "FILE NO": "",
            "CLIENT NAME": "",
            "CONTACT NO": "",
            "EXECUTIVE": "",
            "BANK RM": "",
            "PROD": "",
            " LOAN AMOUNT ": "",
            "ASSET TYPE": "",
            "TENOR": "",
            "ROI": "",
            "BANK": "",
            "STATUS": ""
          }
        }
      );

      console.log(`Cleaned loan with _id: ${loan._id}`);
    }

    console.log("\nAll inconsistent loans have been cleaned.");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error cleaning loans:", error);
    mongoose.disconnect();
  }
}


cleanLoans();
