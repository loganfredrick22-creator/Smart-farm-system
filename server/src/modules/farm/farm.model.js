const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String, default: 'US' },
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    size: { type: Number },
    sizeUnit: { type: String, enum: ['acres', 'hectares'], default: 'acres' },
    livestockCount: { type: Number, default: 0 },
    cropArea: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

farmSchema.index({ ownerId: 1 });
farmSchema.index({ 'address.zipCode': 1 });

const Farm = mongoose.model('Farm', farmSchema);
module.exports = Farm;
