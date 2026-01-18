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

      // --- STEP A: Upload to Cloudinary (Optional, keep if you have it configured) ---
      if (imageFile) {
        setStatusMessage('Uploading Image to Cloud...');
        
        // Note: Make sure you replace these placeholders with your actual Cloudinary details
        // or comment this block out if you aren't using image upload yet.
        const data = new FormData();
        data.append('file', imageFile);
        data.append('upload_preset', 'android_unsigned'); 
        data.append('cloud_name', 'dbxtgjwyv');       

        // Uncomment the fetch below when you are ready to upload images
        
        const res = await fetch('https://api.cloudinary.com/v1_1/dbxtgjwyv/image/upload', {
          method: 'POST',
          body: data
        });
        const file = await res.json();
        console.log(file)
        if (!res.ok) throw new Error('Image upload failed');
        imageUrl = file.secure_url;
        
      }

      // --- STEP B: Submit Article Data to MongoDB ---
      setStatusMessage('Saving Article Data...');

      const finalArticleData = {
        ...formData,
        image: imageUrl, // Will be empty string if upload logic is commented out
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const response = await fetch(`${apiUrl}/api/articles`, {
  method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalArticleData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to save article');
      }

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
              <option value="Productivity">Productivity</option>
              <option value="Events">Events</option>
              <option value="Hostels">Hostels</option>
              <option value="Academics">Academics</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Cover Image</label>
            <input 
              type="file" 
              accept="image/*"
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