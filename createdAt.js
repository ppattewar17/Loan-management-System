const mongoose = require("mongoose");
const Loan = require("./models/loan");

mongoose.connect("mongodb://localhost:27017/CapitalAssist")
  .then(async () => {
    const missingCreatedAt = await Loan.find({ createdAt: { $exists: false } });
    console.log(`Found ${missingCreatedAt.length} loan(s) without createdAt`);
    if (missingCreatedAt.length) {
      missingCreatedAt.forEach(doc => console.log(doc.fileNumber || doc._id));
      await Loan.updateMany({ createdAt: { $exists: false } }, { $set: { createdAt: new Date() } });

    }

    mongoose.disconnect();
  });

  