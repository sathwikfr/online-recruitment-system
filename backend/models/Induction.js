const mongoose = require('mongoose');

const inductionSchema = new mongoose.Schema({
  candidateId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Candidate', 
    required: true 
  },
  teamAssigned: { type: String, required: true },
  onboardingDate: { type: String, required: true },
  mentor: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Scheduled', 'In Progress', 'Completed'],
    default: 'Scheduled'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Induction', inductionSchema);
