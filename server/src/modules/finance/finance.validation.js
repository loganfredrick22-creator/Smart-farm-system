const { z } = require('zod');

const createTransactionSchema = z.object({
  body: z.object({
    type: z.enum(['income', 'expense']),
    category: z.enum([
      'livestock_sale', 'crop_sale', 'milk_sale', 'egg_sale', 'other_income',
      'feed', 'vet_care', 'supplies', 'equipment', 'labor', 'utilities',
      'transport', 'insurance', 'tax', 'loan_payment', 'maintenance', 'other_expense',
    ]),
    amount: z.number().min(0),
    description: z.string().max(500).optional(),
    date: z.string().optional(),
    paymentMethod: z.enum(['cash', 'bank_transfer', 'check', 'credit_card', 'mobile_money', 'other']).optional(),
    reference: z.string().optional(),
    isTaxDeductible: z.boolean().optional(),
  }),
});

const createBudgetSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    category: z.enum(['feed', 'vet_care', 'supplies', 'equipment', 'labor', 'utilities', 'transport', 'insurance', 'tax', 'maintenance', 'other']),
    period: z.enum(['monthly', 'quarterly', 'yearly']),
    year: z.number().int().min(2020).max(2100),
    month: z.number().int().min(1).max(12).optional(),
    allocatedAmount: z.number().min(0),
    notes: z.string().optional(),
  }),
});

module.exports = { createTransactionSchema, createBudgetSchema };
