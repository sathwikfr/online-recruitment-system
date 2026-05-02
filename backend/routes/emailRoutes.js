const express = require('express');
const Candidate = require('../models/Candidate');
const router = express.Router();

// Mock Email Sending Route
router.post('/send', async (req, res) => {
  try {
    const { candidateId, subject, message, type } = req.body;
    
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // In a real production app, you would use Nodemailer or SendGrid here:
    /*
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({ ... });
    await transporter.sendMail({
      from: '"HR Team" <hr@company.com>',
      to: candidate.email,
      subject: subject,
      text: message
    });
    */

    // Simulate network delay for sending email
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Log the "sent" email to the backend console
    console.log(`\n📧 EMAIL SENT TO: ${candidate.email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message:\n${message}\n`);

    res.status(200).json({ 
      success: true, 
      message: `Email successfully sent to ${candidate.name}` 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
