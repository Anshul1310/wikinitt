const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    maxlength: 100,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a short description'],
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
  },
  image: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Article', ArticleSchema);