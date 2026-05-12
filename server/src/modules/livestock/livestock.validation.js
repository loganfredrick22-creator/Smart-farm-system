const { z } = require('zod');

const createLivestockSchema = z.object({
  body: z.object({
    tagId: z.string().min(1).max(20).transform(s => s.toUpperCase()),
    species: z.enum(['cattle', 'goat', 'sheep', 'pig', 'chicken', 'other']),
    breed: z.string().min(1).max(100),
    gender: z.enum(['male', 'female']),
    dateOfBirth: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    weight: z.number().min(0).optional(),
    color: z.string().max(50).optional(),
    location: z.string().max(100).optional(),
    purchaseDate: z.string().optional(),
    purchasePrice: z.number().min(0).optional(),
    notes: z.string().max(500).optional(),
  }),
});

const updateLivestockSchema = z.object({
  body: z.object({
    weight: z.number().min(0).optional(),
    color: z.string().max(50).optional(),
    status: z.enum(['active', 'sold', 'dead', 'slaughtered']).optional(),
    healthStatus: z.enum(['healthy', 'sick', 'recovering', 'quarantined']).optional(),
    location: z.string().max(100).optional(),
    isPregnant: z.boolean().optional(),
    expectedCalvingDate: z.string().optional(),
    milkProduction: z.number().min(0).optional(),
    saleDate: z.string().optional(),
    salePrice: z.number().min(0).optional(),
    notes: z.string().max(500).optional(),
  }),
});

const addVaccinationSchema = z.object({
  body: z.object({
    vaccineName: z.string().min(1),
    dateGiven: z.string(),
    nextDueDate: z.string().optional(),
    batchNumber: z.string().optional(),
  }),
});

const addMedicalRecordSchema = z.object({
  body: z.object({
    date: z.string(),
    diagnosis: z.string().min(1),
    treatment: z.string().optional(),
    medication: z.string().optional(),
    dosage: z.string().optional(),
    notes: z.string().max(1000).optional(),
  }),
});

const addBreedingSchema = z.object({
  body: z.object({
    breedingDate: z.string(),
    method: z.enum(['natural', 'artificial']),
    sireTagId: z.string().optional(),
    result: z.enum(['successful', 'failed', 'unknown']).optional(),
    dueDate: z.string().optional(),
    notes: z.string().max(500).optional(),
  }),
});

module.exports = { createLivestockSchema, updateLivestockSchema, addVaccinationSchema, addMedicalRecordSchema, addBreedingSchema };
