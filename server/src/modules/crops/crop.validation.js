const { z } = require('zod');

const createCropSchema = z.object({
  body: z.object({
    fieldName: z.string().min(1).max(100).trim(),
    cropType: z.string().min(1).max(100),
    variety: z.string().optional(),
    season: z.enum(['spring', 'summer', 'fall', 'winter']),
    year: z.number().int().min(2020).max(2100),
    area: z.number().min(0),
    areaUnit: z.enum(['acres', 'hectares']).optional(),
    plantingDate: z.string(),
    expectedHarvestDate: z.string().optional(),
    expectedYield: z.number().min(0).optional(),
    yieldUnit: z.string().optional(),
    soilType: z.string().optional(),
    irrigationType: z.enum(['drip', 'sprinkler', 'flood', 'rainfed', 'other']).optional(),
    notes: z.string().max(1000).optional(),
  }),
});

const updateCropSchema = z.object({
  body: z.object({
    status: z.enum(['planned', 'planted', 'growing', 'harvested', 'failed']).optional(),
    actualHarvestDate: z.string().optional(),
    actualYield: z.number().min(0).optional(),
    area: z.number().min(0).optional(),
    notes: z.string().max(1000).optional(),
  }),
});

module.exports = { createCropSchema, updateCropSchema };
