const mongoose = require('mongoose');

const driveSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Please provide company name'],
    trim: true
  },
  jobRole: {
    type: String,
    required: [true, 'Please provide job role'],
    trim: true
  },
  ctc: {
    type: String,
    required: [true, 'Please provide CTC'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Please provide location'],
    trim: true
  },
  jobDescription: {
    type: String,
    required: [true, 'Please provide job description']
  },
  eligibilityCriteria: {
    type: String,
    required: [true, 'Please provide eligibility criteria']
  },
  applicationLink: {
    type: String,
    required: [true, 'Please provide application link']
  },
  deadline: {
    type: Date,
    required: [true, 'Please provide deadline']
  },
  driveDate: {
    type: Date,
    required: [true, 'Please provide drive date']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
driveSchema.index({ companyName: 'text', jobRole: 'text' });

module.exports = mongoose.model('Drive', driveSchema);
