const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  resumeUrl: { type: String },
  status: { 
    type: String, 
    enum: ['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'],
    default: 'Applied'
  },
  skills: { type: [String], default: [] },
  linkedinUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Candidate', candidateSchema);
