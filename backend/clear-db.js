const mongoose = require('mongoose');
require('dotenv').config();

const Candidate = require('./models/Candidate');
const Job = require('./models/Job');
const Interview = require('./models/Interview');
const Induction = require('./models/Induction');
const Test = require('./models/Test');

const clearDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Candidate.deleteMany({});
    console.log('🗑️  Cleared Candidates');

    await Job.deleteMany({});
    console.log('🗑️  Cleared Jobs');

    await Interview.deleteMany({});
    console.log('🗑️  Cleared Interviews');

    await Induction.deleteMany({});
    console.log('🗑️  Cleared Inductions');

    await Test.deleteMany({});
    console.log('🗑️  Cleared Tests');

    console.log('✨ All data cleared successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error clearing database:', err);
    process.exit(1);
  }
};

clearDatabase();
