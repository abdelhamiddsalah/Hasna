// seeder.js
const dotenv = require('dotenv');
dotenv.config();

const connectToDb = require('./config/database');
const MorningAzkarModel = require('./models/morning-azkar');
const EveningAzkarModel = require('./models/evening-azkar');
const BeforeSleepAzkarModel = require('./models/before-sleep');
const PrayerModel = require('./models/prayers-model');

const morningAzkarData = require('./data/morning-azkar');
const eveningAzkarData = require('./data/evening-azkar');
const beforeSleepAzkarData = require('./data/before-sleep-azkar');
const prayerData = require('./data/prayers-data');

connectToDb();

const importMorningAzkar = async () => {
    try {
        await MorningAzkarModel.deleteMany({});
        await MorningAzkarModel.insertMany(morningAzkarData);
        console.log('✅ Morning Azkar imported successfully');
        process.exit();
    } catch (error) {
        console.error('❌ Error importing morning azkar:', error);
        process.exit(1);
    }
};

const importEveningAzkar = async () => {
    try {
        await EveningAzkarModel.deleteMany({});
        await EveningAzkarModel.insertMany(eveningAzkarData);
        console.log('✅ Evening Azkar imported successfully');
        process.exit();
    } catch (error) {
        console.error('❌ Error importing evening azkar:', error);
        process.exit(1);
    }
};

const importBeforeSleepAzkar = async () => {
    try {
        await BeforeSleepAzkarModel.deleteMany({});
        await BeforeSleepAzkarModel.insertMany(beforeSleepAzkarData);
        console.log('✅ Before Sleep Azkar imported successfully');
        process.exit();
    } catch (error) {
        console.error('❌ Error importing before sleep azkar:', error);
        process.exit(1);
    }
};

const importPrayers = async () => {
    try {
        await PrayerModel.deleteMany({});
        await PrayerModel.insertMany(prayerData);
        console.log('✅ Before Sleep Azkar imported successfully');
        process.exit();
    } catch (error) {
        console.error('❌ Error importing before sleep azkar:', error);
        process.exit(1);
    }
};


const destroyAzkar = async () => {
    try {
        await MorningAzkarModel.deleteMany({});
        await EveningAzkarModel.deleteMany({});
        await BeforeSleepAzkarModel.deleteMany({});
        await PrayerModel.deleteMany({});
        console.log('🗑️ All Azkar destroyed successfully');
        process.exit();
    } catch (error) {
        console.error('❌ Error destroying azkar:', error);
        process.exit(1);
    }
};

const arg = process.argv[2];

if (arg === '-import-morning') {
    importMorningAzkar();
} else if (arg === '-import-evening') {
    importEveningAzkar();
} else if (arg === '-import-before-sleep') {
    importBeforeSleepAzkar();
} 
else if (arg === '-import-prayers') {
    importPrayers();
} 

else if (arg === '-destroy') {
    destroyAzkar();
} else {
    console.log('❗ Use one of: -import-morning | -import-evening | -import-before-sleep | -destroy');
    process.exit();
}
