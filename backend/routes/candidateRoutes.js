const express = require('express');
const Candidate = require('../models/Candidate');
const Induction = require('../models/Induction');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Multer Config for Resume Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) return cb(null, true);
    cb(new Error('Only .pdf, .doc and .docx files are allowed!'));
  }
});

// Get all candidates
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Track candidate by email
router.get('/track/:email', async (req, res) => {
  try {
    const candidates = await Candidate.find({ email: req.params.email }).sort({ createdAt: -1 });
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new candidate (with resume upload)
router.post('/', upload.single('resume'), async (req, res) => {
  console.log('Post Candidate Body:', req.body);
  console.log('Post Candidate File:', req.file);
  try {
    const candidateData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      status: req.body.status || 'Applied',
      linkedinUrl: req.body.linkedinUrl,
      skills: Array.isArray(req.body.skills) ? req.body.skills : (req.body.skills ? [req.body.skills] : []),
      resumeUrl: req.file ? `http://localhost:5000/uploads/resumes/${req.file.filename}` : req.body.resumeUrl
    };
    console.log('Final Candidate Data:', candidateData);
    const candidate = new Candidate(candidateData);
    const savedCandidate = await candidate.save();
    res.status(201).json(savedCandidate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update candidate status
router.put('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status },
      { new: true }
    );
    
    // Automated Email Notification Simulation
    if (candidate.status !== req.body.status) {
      console.log(`\n📧 AUTOMATED EMAIL SENT TO: ${updatedCandidate.email}`);
      console.log(`Subject: Application Update: ${updatedCandidate.role}`);
      console.log(`Message:`);
      console.log(`Dear ${updatedCandidate.name},`);
      console.log(`Your application status for ${updatedCandidate.role} has been updated to: ${req.body.status}.`);
      console.log(`Our team will be in touch with you shortly with next steps.`);
      console.log(`Best regards,\nThe InternRecruit Team\n`);

      // Auto-schedule Induction if Selected
      if (req.body.status === 'Selected') {
        const now = new Date();
        const nextMonthFirst = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString().split('T')[0];
        
        const newInduction = new Induction({
          candidateId: updatedCandidate._id,
          teamAssigned: updatedCandidate.role.split(' ')[0] || 'Engineering',
          onboardingDate: nextMonthFirst,
          mentor: 'To be assigned',
          status: 'Scheduled'
        });
        await newInduction.save();
        console.log(`✅ Auto-scheduled Induction for ${updatedCandidate.name} on ${nextMonthFirst}`);
      }
    }

    res.json(updatedCandidate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete candidate
router.delete('/:id', async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Candidate removed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
