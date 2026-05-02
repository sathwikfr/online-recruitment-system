const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  candidateId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Candidate', 
    required: true 
  },
  date: { type: String, required: true },
  time: { type: String, required: true },
  interviewer: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  feedback: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Interview', interviewSchema);
