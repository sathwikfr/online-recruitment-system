const express = require('express');
const Test = require('../models/Test');
const Candidate = require('../models/Candidate');
const router = express.Router();

// Get all tests
router.get('/', async (req, res) => {
  try {
    const tests = await Test.find()
      .populate('candidateId', 'name role')
      .sort({ createdAt: -1 });
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Evaluate a test and assign team
router.post('/', async (req, res) => {
  try {
    const { candidateId, testScore, evaluationNotes } = req.body;
    
    // Logic to assign team based on score
    let assignedTeam = 'Pending';
    if (testScore >= 85) {
      assignedTeam = 'Core Engineering Team';
    } else if (testScore >= 70) {
      assignedTeam = 'Support Engineering Team';
    } else {
      assignedTeam = 'Training Pool';
    }

    const test = new Test({
      candidateId,
      testScore,
      evaluationNotes,
      assignedTeam
    });

    const savedTest = await test.save();
    
    // Optionally update the Candidate's status to reflect they have been assigned a team
    await Candidate.findByIdAndUpdate(candidateId, { status: 'Selected' });

    const populated = await savedTest.populate('candidateId', 'name role');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
