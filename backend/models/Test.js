const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  candidateId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Candidate', 
    required: true 
  },
  testScore: { type: Number, required: true },
  evaluationNotes: { type: String },
  assignedTeam: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Test', testSchema);
