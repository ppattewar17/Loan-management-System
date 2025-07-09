const express = require('express');
const router = express.Router();
const Loan = require('../models/loan'); // Assuming you have a Loan model

// GET route to fetch all loans

router.get('/', async (req, res) => {
  try {
    const loans = await Loan.find().sort({ _id: -1 }).limit(5);
    res.json(loans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch loan applications.' });
  }
});


// POST route to add a loan
router.post('/', async (req, res) => {
  const {  fileNumber,
    clientName,
    executive,
    bankRM,
    product,
    loanAmount,
    assetType,
    tenor,
    roi,
    bankName,
    status, } = req.body;

  const newLoan = new Loan({
    fileNumber,
    clientName,
    executive,
    bankRM,
    product,
    loanAmount,
    assetType,
    tenor,
    roi,
    bankName,
    status,
    createdAt: new Date()
  });

  try {
    await newLoan.save();
    res.status(201).json({ message: 'Loan application added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add loan application.' });
  }
});

// DELETE route to remove a loan by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedLoan = await Loan.findByIdAndDelete(req.params.id);
    if (!deletedLoan) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    res.json({ message: 'Loan deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete loan' });
  }
});

// PUT route to update a loan by ID
router.put('/:id', async (req, res) => {
  const { fileNumber,
    clientName,
    executive,
    bankRM,
    product,
    loanAmount,
    assetType,
    tenor,
    roi,
    bankName,
    status } = req.body;

  try {
    const updatedLoan = await Loan.findByIdAndUpdate(
      req.params.id,
      { fileNumber,
        clientName,
        executive,
        bankRM,
        product,
        loanAmount,
        assetType,
        tenor,
        roi,
        bankName,
        status },
      { new: true }
    );

    if (!updatedLoan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    res.json({ message: 'Loan updated successfully', loan: updatedLoan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update loan' });
  }
});

router.get('/report', async (req, res) => {
  try {
    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.bankName) query.bankName = req.query.bankName;

    const loans = await Loan.find(query);
    res.json(loans);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});



module.exports = router;




