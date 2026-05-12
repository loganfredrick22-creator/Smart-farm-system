const mongoose = require('mongoose');

const cropCycleSchema = new mongoose.Schema({
  stage: { type: String, enum: ['planting', 'growing', 'flowering', 'harvesting', 'fallow'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  notes: { type: String },
}, { _id: true });

const treatmentSchema = new mongoose.Schema({
  type: { type: String, enum: ['fertilizer', 'pesticide', 'herbicide', 'irrigation', 'other'], required: true },
  productName: { type: String },
  amount: { type: Number },
  unit: { type: String },
  date: { type: Date, required: true },
  notes: { type: String },
}, { _id: true });

const cropSchema = new mongoose.Schema(
  {
    farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fieldName: { type: String, required: true, trim: true },
    cropType: { type: String, required: true },
    variety: { type: String },
    season: { type: String, enum: ['spring', 'summer', 'fall', 'winter'], required: true },
    year: { type: Number, required: true },
    area: { type: Number, required: true },
    areaUnit: { type: String, enum: ['acres', 'hectares'], default: 'acres' },
    plantingDate: { type: Date, required: true },
    expectedHarvestDate: { type: Date },
    actualHarvestDate: { type: Date },
    status: {
      type: String,
      enum: ['planned', 'planted', 'growing', 'harvested', 'failed'],
      default: 'planned',
    },
    expectedYield: { type: Number },
    actualYield: { type: Number },
    yieldUnit: { type: String, default: 'kg' },
    growthCycles: [cropCycleSchema],
    treatments: [treatmentSchema],
    soilType: { type: String },
    irrigationType: { type: String, enum: ['drip', 'sprinkler', 'flood', 'rainfed', 'other'] },
    notes: { type: String, maxlength: 1000 },
  },
  { timestamps: true }
);

cropSchema.index({ farmId: 1, season: 1, year: 1 });
cropSchema.index({ status: 1 });
cropSchema.index({ ownerId: 1 });

const Crop = mongoose.model('Crop', cropSchema);
module.exports = Crop;
