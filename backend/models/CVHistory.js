const mongoose = require('mongoose');

const cvHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  templateId: {
    type: String,
    required: true,
    enum: ['template1', 'template2', 'template3']
  },
  templateName: {
    type: String,
    required: true
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  filename: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number
  },
  cvData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
});

// Index for efficient querying
cvHistorySchema.index({ user: 1, generatedAt: -1 });

module.exports = mongoose.model('CVHistory', cvHistorySchema);