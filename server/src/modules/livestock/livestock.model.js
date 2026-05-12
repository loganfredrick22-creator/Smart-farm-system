const mongoose = require('mongoose');

const vaccinationSchema = new mongoose.Schema({
  vaccineName: { type: String, required: true },
  dateGiven: { type: Date, required: true },
  nextDueDate: { type: Date },
  administeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  batchNumber: { type: String },
}, { _id: true });

const medicalRecordSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  diagnosis: { type: String, required: true },
  treatment: { type: String },
  medication: { type: String },
  dosage: { type: String },
  veterinarianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: { type: String },
  attachments: [{
    public_id: { type: String },
    url: { type: String },
  }],
}, { _id: true });

const breedingSchema = new mongoose.Schema({
  breedingDate: { type: Date, required: true },
  method: { type: String, enum: ['natural', 'artificial'], required: true },
  sireTagId: { type: String },
  result: { type: String, enum: ['successful', 'failed', 'unknown'], default: 'unknown' },
  dueDate: { type: Date },
  notes: { type: String },
}, { _id: true });

const livestockSchema = new mongoose.Schema(
  {
    tagId: { type: String, required: true, unique: true, uppercase: true, trim: true },
    farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    species: {
      type: String,
      enum: ['cattle', 'goat', 'sheep', 'pig', 'chicken', 'other'],
      required: true,
    },
    breed: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    dateOfBirth: { type: Date, required: true },
    weight: { type: Number, min: 0 },
    color: { type: String },
    status: {
      type: String,
      enum: ['active', 'sold', 'dead', 'slaughtered'],
      default: 'active',
    },
    healthStatus: {
      type: String,
      enum: ['healthy', 'sick', 'recovering', 'quarantined'],
      default: 'healthy',
    },
    location: { type: String },
    purchaseDate: { type: Date },
    purchasePrice: { type: Number },
    saleDate: { type: Date },
    salePrice: { type: Number },
    images: [{
      public_id: { type: String },
      url: { type: String },
    }],
    vaccinations: [vaccinationSchema],
    medicalRecords: [medicalRecordSchema],
    breedingHistory: [breedingSchema],
    isPregnant: { type: Boolean, default: false },
    expectedCalvingDate: { type: Date },
    milkProduction: { type: Number },
    notes: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

livestockSchema.index({ farmId: 1, species: 1 });
livestockSchema.index({ status: 1, healthStatus: 1 });
livestockSchema.index({ ownerId: 1 });

const Livestock = mongoose.model('Livestock', livestockSchema);
module.exports = Livestock;
