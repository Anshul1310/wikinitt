const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const slugify = require('slugify');

// GET /api/articles - Get all articles (Sorted by newest)
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: articles });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /api/articles - Create a new article
router.post('/', async (req, res) => {
  try {
    const { title, slug, ...otherProps } = req.body;
    
    // Auto-generate slug if not provided
    let articleSlug = slug;
    if (!articleSlug && title) {
      articleSlug = slugify(title, { lower: true, strict: true });
    }

    const article = await Article.create({
      title,
      slug: articleSlug,
      ...otherProps
    });
    
    res.status(201).json({ success: true, data: article });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET /api/articles/:slug - Get single article
router.get('/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    
    if (!article) {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }
    
    res.status(200).json({ success: true, data: article });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;