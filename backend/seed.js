require('dotenv').config();
const mongoose = require('mongoose');
const Article = require('./models/Article');
const fs = require('fs');

// 1. Connect to DB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

const importData = async () => {
  try {
    // 2. Read the JSON file
    const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));

    // 3. Clear existing data (Optional: Remove this line if you want to keep old data)
    await Article.deleteMany();
    console.log('Old articles removed...');

    // 4. Insert new data
    await Article.insertMany(data);
    console.log('Data Imported Successfully!');

    process.exit();
  } catch (error) {
    console.error('Error with data import:', error);
    process.exit(1);
  }
};

importData();