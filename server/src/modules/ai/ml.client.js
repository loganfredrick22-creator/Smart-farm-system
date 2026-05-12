const env = require('../../config/env');

const predictDisease = async (symptoms, species, breed) => {
  try {
    const { default: fetch } = await import('node-fetch');
    const response = await fetch(`${env.mlService.url}/predict/disease`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': env.mlService.apiKey,
      },
      body: JSON.stringify({ symptoms, species, breed }),
    });
    if (!response.ok) throw new Error(`ML service error: ${response.status}`);
    return response.json();
  } catch (error) {
    console.warn('ML service unavailable, using fallback:', error.message);
    return null;
  }
};

const predictYield = async (cropType, season, area, soilType, historicalData) => {
  try {
    const { default: fetch } = await import('node-fetch');
    const response = await fetch(`${env.mlService.url}/predict/yield`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': env.mlService.apiKey,
      },
      body: JSON.stringify({ cropType, season, area, soilType, historicalData }),
    });
    if (!response.ok) throw new Error(`ML service error: ${response.status}`);
    return response.json();
  } catch (error) {
    console.warn('ML service unavailable, using fallback:', error.message);
    return null;
  }
};

module.exports = { predictDisease, predictYield };
