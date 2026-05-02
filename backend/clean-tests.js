const mongoose = require('mongoose');
const Candidate = require('./models/Candidate');

async function cleanTests() {
  try {
    await mongoose.connect('mongodb://localhost:27017/intern-recruit');
    const res = await Candidate.deleteMany({ 
      email: { $in: ['finaltest@example.com', 'browsertest@example.com'] } 
    });
    console.log(`Deleted ${res.deletedCount} test candidates.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

cleanTests();
