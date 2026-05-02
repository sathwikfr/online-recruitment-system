const express = require('express');
const Induction = require('../models/Induction');
const Test = require('../models/Test');
const router = express.Router();

// Get all inductions
router.get('/', async (req, res) => {
  try {
    const inductions = await Induction.find()
      .populate('candidateId', 'name email role')
      .sort({ createdAt: -1 });
    res.json(inductions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Schedule induction
router.post('/', async (req, res) => {
  try {
    const induction = new Induction(req.body);
    const savedInduction = await induction.save();
    
    const populated = await savedInduction.populate('candidateId', 'name email role');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update induction status
router.put('/:id', async (req, res) => {
  try {
    const updatedInduction = await Induction.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true }
    ).populate('candidateId', 'name email role');
    res.json(updatedInduction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
