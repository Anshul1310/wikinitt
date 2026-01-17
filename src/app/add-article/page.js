"use client";

import { useState } from 'react';
import styles from './add.module.css';

export default function AddArticlePage() {
  // 1. Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Technology',
    description: '',
    content: ''
  });
  const [imageFile, setImageFile] = useState(null);

  // 2. Loading State
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Handle Text Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle File Selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // 3. Submit Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';

      // --- STEP A: Upload to Cloudinary ---
      if (imageFile) {
        setStatusMessage('Uploading Image to Cloud...');
        
        const data = new FormData();
        data.append('file', imageFile);
        data.append('upload_preset', 'YOUR_UPLOAD_PRESET'); // <--- REPLACE THIS
        data.append('cloud_name', 'YOUR_CLOUD_NAME');       // <--- REPLACE THIS

        const res = await fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', {
          method: 'POST',
          body: data
        });

        const file = await res.json();
        
        if (!res.ok) throw new Error('Image upload failed');
        imageUrl = file.secure_url;
      }

      // --- STEP B: Submit Article Data ---
      setStatusMessage('Saving Article Data...');

      // Combine form data with the new image URL
      const finalArticleData = {
        ...formData,
        image: imageUrl,
        date: new Date().toISOString()
      };

      // Call your Next.js API (Simulated here)
      // await fetch('/api/articles', { method: 'POST', body: JSON.stringify(finalArticleData) });
      
      // Simulating a delay for demo purposes so you can see the dialog
      await new Promise(resolve => setTimeout(resolve, 1500));

      alert('Article Published Successfully!');
      
      // Reset Form
      setFormData({ title: '', category: 'Technology', description: '', content: '' });
      setImageFile(null);

    } catch (error) {
      console.error(error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      
      {/* --- Progress Dialog Overlay --- */}
      {loading && (
        <div className={styles.overlay}>
          <div className={styles.dialog}>
            <div className={styles.spinner}></div>
            <p className={styles.dialogText}>{statusMessage}</p>
          </div>
        </div>
      )}

      <h1 className={styles.heading}>Write New Article</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        
        {/* Title */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Article Title</label>
          <input 
            className={styles.input}
            type="text" 
            name="title"
            required
            placeholder="e.g. The Future of Design"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        {/* Category & Image Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Category</label>
            <select 
              className={styles.select} 
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Technology">Technology</option>
              <option value="Design">Design</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Business">Business</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Cover Image</label>
            <input 
              type="file" 
              accept="image/*"
              required
              className={`${styles.input} ${styles.fileInput}`}
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Short Description */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Short Description</label>
          <textarea 
            className={styles.textarea}
            name="description"
            required
            placeholder="A brief summary for the preview card..."
            value={formData.description}
            onChange={handleChange}
            style={{ minHeight: '80px' }}
          />
        </div>

        {/* Main Content */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Main Content (HTML/Markdown)</label>
          <textarea 
            className={styles.textarea}
            name="content"
            required
            placeholder="Write your article content here..."
            value={formData.content}
            onChange={handleChange}
            style={{ minHeight: '200px' }}
          />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Processing...' : 'Publish Article'}
        </button>

      </form>
    </div>
  );
}