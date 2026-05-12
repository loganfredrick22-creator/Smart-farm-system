const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: {
      type: String,
      enum: [
        'livestock_sale', 'crop_sale', 'milk_sale', 'egg_sale', 'other_income',
        'feed', 'vet_care', 'supplies', 'equipment', 'labor', 'utilities',
        'transport', 'insurance', 'tax', 'loan_payment', 'maintenance', 'other_expense',
      ],
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    description: { type: String, maxlength: 500 },
    date: { type: Date, required: true, default: Date.now },
    paymentMethod: { type: String, enum: ['cash', 'bank_transfer', 'check', 'credit_card', 'mobile_money', 'other'] },
    reference: { type: String },
    relatedTo: {
      type: { type: String, enum: ['livestock', 'crop', 'none'] },
      id: { type: mongoose.Schema.Types.ObjectId },
    },
    receiptUrl: { type: String },
    isTaxDeductible: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const budgetSchema = new mongoose.Schema(
  {
    farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: [
      'feed', 'vet_care', 'supplies', 'equipment', 'labor', 'utilities',
      'transport', 'insurance', 'tax', 'maintenance', 'other',
    ] },
    period: { type: String, enum: ['monthly', 'quarterly', 'yearly'], required: true },
    year: { type: Number, required: true },
    month: { type: Number, min: 1, max: 12 },
    allocatedAmount: { type: Number, required: true, min: 0 },
    spentAmount: { type: Number, default: 0, min: 0 },
    notes: { type: String },
  },
  { timestamps: true }
);

transactionSchema.index({ farmId: 1, date: -1 });
transactionSchema.index({ farmId: 1, category: 1 });
transactionSchema.index({ type: 1 });
budgetSchema.index({ farmId: 1, period: 1, year: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);
const Budget = mongoose.model('Budget', budgetSchema);

module.exports = { Transaction, Budget };
