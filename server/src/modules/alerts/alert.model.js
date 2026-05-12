const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: {
      type: String,
      enum: ['health', 'weather', 'breeding', 'vaccination', 'financial', 'system', 'task'],
      required: true,
    },
    severity: { type: String, enum: ['info', 'warning', 'critical'], default: 'info' },
    title: { type: String, required: true, maxlength: 200 },
    message: { type: String, required: true, maxlength: 1000 },
    relatedTo: {
      type: { type: String, enum: ['livestock', 'crop', 'transaction', 'health', 'none'] },
      id: { type: mongoose.Schema.Types.ObjectId },
    },
    isRead: { type: Boolean, default: false },
    isResolved: { type: Boolean, default: false },
    actionRequired: { type: Boolean, default: false },
    actionUrl: { type: String },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

alertSchema.index({ farmId: 1, createdAt: -1 });
alertSchema.index({ userId: 1, isRead: 1 });
alertSchema.index({ type: 1, severity: 1 });
alertSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Alert = mongoose.model('Alert', alertSchema);
module.exports = Alert;
