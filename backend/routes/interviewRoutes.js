const express = require('express');
const Interview = require('../models/Interview');
const router = express.Router();

// Get all interviews (populate candidate details)
router.get('/', async (req, res) => {
  try {
    const interviews = await Interview.find()
      .populate('candidateId', 'name role')
      .sort({ date: 1, time: 1 });
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Schedule an interview
router.post('/', async (req, res) => {
  try {
    const interview = new Interview(req.body);
    const savedInterview = await interview.save();
    
    // Populate candidate data before returning so UI can show name/role immediately
    const populated = await savedInterview.populate('candidateId', 'name role');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update interview (e.g., add feedback, change status)
router.put('/:id', async (req, res) => {
  try {
    const updatedInterview = await Interview.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true }
    ).populate('candidateId', 'name role');
    res.json(updatedInterview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
