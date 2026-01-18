"use client";

import { useEffect, useState } from 'react';
import styles from './article.module.css'; // Re-using your existing styles

export default function ShareButtons({ title }) {
  const [currentUrl, setCurrentUrl] = useState('');

  // Get the current URL from the browser window once the component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  // Helper to generate share links
  const getShareLink = (platform) => {
    if (!currentUrl) return '#'; // Fallback while loading
    
    const text = encodeURIComponent(title);
    const url = encodeURIComponent(currentUrl);

    switch (platform) {
      case 'twitter':
        return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
      default:
        return '#';
    }
  };

  return (
    <aside className={styles.sidebar}>
      <span className={styles.shareLabel}>Share</span>
      
      {/* Twitter / X */}
      <a 
        href={getShareLink('twitter')} 
        target="_blank" 
        rel="noopener noreferrer"
        className={styles.socialIcon} 
        aria-label="Share on Twitter"
      >
         <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
      </a>
      
      {/* Facebook */}
      <a 
        href={getShareLink('facebook')} 
        target="_blank" 
        rel="noopener noreferrer"
        className={styles.socialIcon} 
        aria-label="Share on Facebook"
      >
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
      </a>
      
      {/* LinkedIn */}
      <a 
        href={getShareLink('linkedin')} 
        target="_blank" 
        rel="noopener noreferrer"
        className={styles.socialIcon} 
        aria-label="Share on LinkedIn"
      >
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
      </a>
    </aside>
  );
}