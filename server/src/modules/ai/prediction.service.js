const mlClient = require('./ml.client');

const getDiseasePrediction = async (livestockId, symptoms, species, breed) => {
  const result = await mlClient.predictDisease(symptoms, species, breed);
  if (result) return result;
  return {
    source: 'rule-based-fallback',
    predictions: [{ disease: 'No prediction available', confidence: 0 }],
    message: 'ML service offline — rule-based fallback',
  };
};

const getYieldPrediction = async (cropType, season, area, soilType, historicalData) => {
  const result = await mlClient.predictYield(cropType, season, area, soilType, historicalData);
  if (result) return result;
  return {
    source: 'rule-based-fallback',
    predictedYield: area * 1.5,
    unit: 'kg',
    confidence: 0.5,
    message: 'ML service offline — rule-based fallback',
  };
};

module.exports = { getDiseasePrediction, getYieldPrediction };
