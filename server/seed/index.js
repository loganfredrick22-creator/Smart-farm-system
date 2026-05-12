const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const User = require('../src/modules/users/user.model');
const Farm = require('../src/modules/farm/farm.model');
const Livestock = require('../src/modules/livestock/livestock.model');
const { Transaction } = require('../src/modules/finance/finance.model');
const Alert = require('../src/modules/alerts/alert.model');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    await Promise.all([
      User.deleteMany({}), Farm.deleteMany({}),
      Livestock.deleteMany({}), Transaction.deleteMany({}),
      Alert.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    const admin = await User.create({
      firstName: 'System', lastName: 'Admin', email: 'admin@smartfarm.com',
      password: 'Admin123!', role: 'admin', isActive: true,
    });

    const farmer = await User.create({
      firstName: 'John', lastName: 'Farmer', email: 'farmer@smartfarm.com',
      password: 'Farmer123!', role: 'farmer', isActive: true,
    });

    const vet = await User.create({
      firstName: 'Sarah', lastName: 'Vet', email: 'vet@smartfarm.com',
      password: 'Vet123!', role: 'vet', isActive: true,
    });

    const farm = await Farm.create({
      name: 'Green Valley Farm', ownerId: farmer._id,
      address: { city: 'Nairobi', state: 'Nairobi', country: 'KE' },
      size: 150, sizeUnit: 'acres',
    });

    await User.findByIdAndUpdate(farmer._id, { farmId: farm._id });
    await User.findByIdAndUpdate(vet._id, { farmId: farm._id });

    const animals = await Livestock.insertMany([
      { tagId: 'BF-001', farmId: farm._id, ownerId: farmer._id, species: 'cattle', breed: 'Angus', gender: 'male', dateOfBirth: new Date('2022-03-15'), weight: 680, color: 'Black', healthStatus: 'healthy', location: 'North Pasture' },
      { tagId: 'BF-002', farmId: farm._id, ownerId: farmer._id, species: 'cattle', breed: 'Holstein', gender: 'female', dateOfBirth: new Date('2021-07-20'), weight: 590, color: 'Black & White', healthStatus: 'healthy', location: 'Barn A', isPregnant: true, milkProduction: 25 },
      { tagId: 'GF-001', farmId: farm._id, ownerId: farmer._id, species: 'goat', breed: 'Nubian', gender: 'female', dateOfBirth: new Date('2023-01-10'), weight: 65, color: 'Brown', healthStatus: 'healthy', location: 'Goat Pen' },
      { tagId: 'SH-001', farmId: farm._id, ownerId: farmer._id, species: 'sheep', breed: 'Merino', gender: 'female', dateOfBirth: new Date('2022-11-05'), weight: 75, color: 'White', healthStatus: 'recovering', location: 'Sheep Barn' },
    ]);

    await Transaction.insertMany([
      { farmId: farm._id, createdBy: farmer._id, type: 'income', category: 'livestock_sale', amount: 450000, description: 'Sold 2 Friesian cows', date: new Date('2024-01-15') },
      { farmId: farm._id, createdBy: farmer._id, type: 'income', category: 'milk_sale', amount: 185000, description: 'Monthly milk sales to cooperative', date: new Date('2024-01-20') },
      { farmId: farm._id, createdBy: farmer._id, type: 'expense', category: 'feed', amount: 95000, description: 'Dairy meal & hay purchase', date: new Date('2024-01-10') },
      { farmId: farm._id, createdBy: farmer._id, type: 'expense', category: 'vet_care', amount: 35000, description: 'Vaccination & deworming program', date: new Date('2024-01-05') },
      { farmId: farm._id, createdBy: farmer._id, type: 'income', category: 'crop_sale', amount: 320000, description: 'Maize harvest sale at Kathonzweni', date: new Date('2024-02-01') },
      { farmId: farm._id, createdBy: farmer._id, type: 'expense', category: 'supplies', amount: 45000, description: 'Fencing materials - Nairobi Hardware', date: new Date('2024-02-10') },
    ]);

    await Alert.insertMany([
      { farmId: farm._id, userId: farmer._id, type: 'vaccination', severity: 'warning', title: 'Vaccination Due', message: 'BF-002 is due for booster vaccination', relatedTo: { type: 'livestock', id: animals[1]._id }, actionRequired: true },
      { farmId: farm._id, userId: farmer._id, type: 'health', severity: 'critical', title: 'Health Alert', message: 'SH-001 has elevated temperature - check required', relatedTo: { type: 'livestock', id: animals[3]._id }, actionRequired: true },
      { farmId: farm._id, userId: farmer._id, type: 'financial', severity: 'info', title: 'Monthly Report Ready', message: 'January financial report is available for review', actionRequired: false },
    ]);

    console.log('\nSeed data created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:   admin@smartfarm.com / Admin123!');
    console.log('Farmer:  farmer@smartfarm.com / Farmer123!');
    console.log('Vet:     vet@smartfarm.com / Vet123!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
