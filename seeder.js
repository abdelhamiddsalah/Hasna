// seeder.js
const dotenv = require('dotenv');
dotenv.config();

const connectToDb = require('./config/database');
const MorningAzkarModel = require('./models/morning-azkar');
const EveningAzkarModel = require('./models/evening-azkar');
const BeforeSleepAzkarModel = require('./models/before-sleep');
const PrayerModel = require('./models/prayers-model');
const AfterPrayModel = require('./models/after-pray-model');
const BathroomAzkarModel = require('./models/bathroom-azkar-model');
const WedooAzkarModel = require('./models/wedoo-azkar-model');
const HadithModel = require('./models/hadith-model'); // ✨ عدلت الاسم هنا

const morningAzkarData = require('./data/morning-azkar');
const eveningAzkarData = require('./data/evening-azkar');
const beforeSleepAzkarData = require('./data/before-sleep-azkar');
const prayerData = require('./data/prayers-data');
const afterPrayData = require('./data/after-pray-data');
const bathroomAzkarData = require('./data/bathroom-azkar-data');
const wedooAzkarData = require('./data/wedoo-azkar-data');
const hadithData = require('./data/hadiths');

connectToDb();

// ✅ عملت دالة عامة تستورد أي بيانات
const importData = async (Model, data, name) => {
    try {
        await Model.deleteMany({});
        await Model.insertMany(data);
        console.log(`✅ ${name} imported successfully`);
    } catch (error) {
        console.error(`❌ Error importing ${name}:`, error);
        process.exit(1);
    }
};

// ✅ عملت دالة تدمر الكل
const destroyAzkar = async () => {
    try {
        await MorningAzkarModel.deleteMany({});
        await EveningAzkarModel.deleteMany({});
        await BeforeSleepAzkarModel.deleteMany({});
        await PrayerModel.deleteMany({});
        await AfterPrayModel.deleteMany({});
        await BathroomAzkarModel.deleteMany({});
        await WedooAzkarModel.deleteMany({});
        await HadithModel.deleteMany({});
        console.log('🗑️ All Azkar and Hadiths destroyed successfully');
        process.exit();
    } catch (error) {
        console.error('❌ Error destroying data:', error);
        process.exit(1);
    }
};

// ✅ دالة لاستيراد جميع البيانات دفعة واحدة
const importAllData = async () => {
    try {
        await importData(MorningAzkarModel, morningAzkarData, 'Morning Azkar');
        await importData(EveningAzkarModel, eveningAzkarData, 'Evening Azkar');
        await importData(BeforeSleepAzkarModel, beforeSleepAzkarData, 'Before Sleep Azkar');
        await importData(PrayerModel, prayerData, 'Prayers');
        await importData(AfterPrayModel, afterPrayData, 'After Pray Azkar');
        await importData(BathroomAzkarModel, bathroomAzkarData, 'Bathroom Azkar');
        await importData(WedooAzkarModel, wedooAzkarData, 'Wedoo Azkar');
        await importData(HadithModel, hadithData, 'Hadiths');

        console.log('✅ All data imported successfully');
        process.exit();
    } catch (error) {
        console.error('❌ Error importing all data:', error);
        process.exit(1);
    }
};

// ✅ حسب البراميتر اللي يجي من الكوماند لاين
const arg = process.argv[2];

if (arg === '-import-all') {
    importAllData();
} else if (arg === '-import-morning') {
    importData(MorningAzkarModel, morningAzkarData, 'Morning Azkar');
} else if (arg === '-import-evening') {
    importData(EveningAzkarModel, eveningAzkarData, 'Evening Azkar');
} else if (arg === '-import-before-sleep') {
    importData(BeforeSleepAzkarModel, beforeSleepAzkarData, 'Before Sleep Azkar');
} else if (arg === '-import-prayers') {
    importData(PrayerModel, prayerData, 'Prayers');
} else if (arg === '-import-after-prays-azkar') {
    importData(AfterPrayModel, afterPrayData, 'After Pray Azkar');
} else if (arg === '-import-bathroom-azkar') {
    importData(BathroomAzkarModel, bathroomAzkarData, 'Bathroom Azkar');
} else if (arg === '-import-wedoo-azkar') {
    importData(WedooAzkarModel, wedooAzkarData, 'Wedoo Azkar');
} else if (arg === '-import-hadith') {
    importData(HadithModel, hadithData, 'Hadiths');
} else if (arg === '-destroy') {
    destroyAzkar();
} else {
    console.log('❗ Use one of: -import-all | -import-morning | -import-evening | -import-before-sleep | -import-prayers | -import-after-prays-azkar | -import-bathroom-azkar | -import-wedoo-azkar | -import-hadith | -destroy');
    process.exit();
}
