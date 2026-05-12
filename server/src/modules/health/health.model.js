const mongoose = require('mongoose');

const healthCheckSchema = new mongoose.Schema(
  {
    farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    livestockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Livestock', required: true },
    veterinarianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    checkType: {
      type: String,
      enum: ['routine', 'emergency', 'follow_up', 'vaccination', 'breeding_check'],
      required: true,
    },
    diagnosis: { type: String, required: true },
    symptoms: [{ type: String }],
    temperature: { type: Number },
    weight: { type: Number },
    treatment: { type: String },
    medication: [{
      name: { type: String, required: true },
      dosage: { type: String },
      frequency: { type: String },
      duration: { type: String },
    }],
    notes: { type: String, maxlength: 1000 },
    followUpDate: { type: Date },
    status: { type: String, enum: ['open', 'closed', 'follow_up_required'], default: 'open' },
    attachments: [{
      public_id: { type: String },
      url: { type: String },
    }],
  },
  { timestamps: true }
);

healthCheckSchema.index({ livestockId: 1, createdAt: -1 });
healthCheckSchema.index({ veterinarianId: 1 });
healthCheckSchema.index({ farmId: 1, status: 1 });

const HealthCheck = mongoose.model('HealthCheck', healthCheckSchema);
module.exports = HealthCheck;
