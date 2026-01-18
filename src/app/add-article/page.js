"use client";

import { useState, useEffect, useRef } from 'react';
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

  // 2. Loading & UI State
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  
  // 3. Autocomplete State
  const [articles, setArticles] = useState([]); // Database of articles
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [mentionQuery, setMentionQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  
  const contentRef = useRef(null); // Reference to the textarea

  // --- EFFECT: Fetch Articles for Autocomplete ---
  useEffect(() => {
    async function fetchArticles() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/articles`);
        const data = await res.json();
        if (data.success) {
          setArticles(data.data);
        }
      } catch (error) {
        console.error("Could not fetch articles for autocomplete", error);
      }
    }
    fetchArticles();
  }, []);

  // Handle Standard Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- SPECIAL HANDLER: Content Input with @ Mention Detection ---
  const handleContentChange = (e) => {
    const value = e.target.value;
    const selectionStart = e.target.selectionStart;
    
    // Update basic form state
    setFormData({ ...formData, content: value });
    setCursorPosition(selectionStart);

    // 1. Find the word being typed
    // Look backwards from cursor to find the nearest @
    const lastAtSymbol = value.lastIndexOf('@', selectionStart - 1);
    
    if (lastAtSymbol !== -1) {
      // Check if it's a valid mention (start of line or preceded by space)
      const prevChar = value.charAt(lastAtSymbol - 1);
      const isStartOfWord = lastAtSymbol === 0 || /\s/.test(prevChar);

      if (isStartOfWord) {
        // Extract the query text after @
        const query = value.substring(lastAtSymbol + 1, selectionStart);
        
        // Check if query contains spaces (usually stops mention)
        // You can allow spaces if you want multi-word search
        if (!query.includes('\n')) { 
          setMentionQuery(query);
          
          // Filter articles
          const matches = articles.filter(a => 
            a.title.toLowerCase().includes(query.toLowerCase())
          );
          
          setFilteredArticles(matches);
          setShowSuggestions(matches.length > 0);
          return;
        }
      }
    }

    // Hide if no match found
    setShowSuggestions(false);
  };

  // --- ACTION: Select Article from Dropdown ---
  const handleSelectArticle = (article) => {
    const value = formData.content;
    const lastAtSymbol = value.lastIndexOf('@', cursorPosition - 1);
    
    if (lastAtSymbol !== -1) {
      const beforeMention = value.substring(0, lastAtSymbol);
      const afterMention = value.substring(cursorPosition);
      
      // Create HTML Link
      const linkHtml = `<a href="/article/${article.slug}" style="color: #2563eb; text-decoration: underline;">${article.title}</a>`;
      
      const newValue = beforeMention + linkHtml + ' ' + afterMention;
      
      setFormData({ ...formData, content: newValue });
      setShowSuggestions(false);
      
      // Focus back on textarea
      if(contentRef.current) {
        contentRef.current.focus();
      }
    }
  };

  // Handle File Selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // Submit Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';

      // Upload Logic (Keep your Cloudinary code here)
      if (imageFile) {
        setStatusMessage('Uploading Image...');
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
        if (!res.ok) throw new Error('Image upload failed');
        imageUrl = file.secure_url;
      }

      setStatusMessage('Publishing...');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const finalArticleData = {
        ...formData,
        image: imageUrl,
      };

      const response = await fetch(`${apiUrl}/api/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalArticleData),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      alert('Article Published Successfully!');
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
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Article Title</label>
          <input 
            className={styles.input}
            type="text" 
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Category</label>
            <select 
              className={styles.select} 
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Department">Department</option>
              <option value="Hostel">Hostel</option>
              <option value="StudentLife">Student Life</option>
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

        <div className={styles.formGroup}>
          <label className={styles.label}>Short Description</label>
          <textarea 
            className={styles.textarea}
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            style={{ minHeight: '80px' }}
          />
        </div>

        {/* --- Main Content with Autocomplete --- */}
        <div className={styles.formGroup} style={{ position: 'relative' }}>
          <label className={styles.label}>
            Main Content 
            <span style={{fontWeight:'normal', fontSize:'12px', marginLeft:'10px', color:'#666'}}>
              (Type <strong>@</strong> to link other articles)
            </span>
          </label>
          
          <textarea 
            ref={contentRef}
            className={styles.textarea}
            name="content"
            required
            placeholder="Type @ to search for articles..."
            value={formData.content}
            onChange={handleContentChange}
            style={{ minHeight: '200px' }}
          />

          {/* Autocomplete Dropdown */}
          {showSuggestions && (
            <div className={styles.suggestionsList}>
              {filteredArticles.map(article => (
                <div 
                  key={article._id}
                  className={styles.suggestionItem}
                  onClick={() => handleSelectArticle(article)}
                >
                  <span className={styles.suggestionTitle}>{article.title}</span>
                  <span className={styles.suggestionCategory}>{article.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Processing...' : 'Publish Article'}
        </button>

      </form>
    </div>
  );
}