import mongoose from 'mongoose';

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
    required: false, // Optional if you want default images
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Article || mongoose.model('Article', ArticleSchema);