"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // 1. Import useRouter
import Navbar from "@/components/navbar/Navbar"; 
import styles from "./home.module.css";

// Carousel Images
const heroImages = [
  "https://res.cloudinary.com/dbxtgjwyv/image/upload/v1768746331/16284893_n3s1ub.jpg", 
  "https://res.cloudinary.com/dbxtgjwyv/image/upload/v1768746331/16284907_xifwe2.jpg",
  "https://res.cloudinary.com/dbxtgjwyv/image/upload/v1768746331/16284893_n3s1ub.jpg", 
];

export default function Home() {
  const router = useRouter(); // 2. Initialize Router
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // 3. Search Handler
  const handleSearch = (query) => {
    // if (query && query.trim() !== "") {
    //   // Navigate to articles page with search query
    //   router.push(`/articles?search=${encodeURIComponent(query)}`);
    // } else {
    //   // Just go to articles page if empty
    //   router.push('/articles');
    // }

    router.push('/articles');
  };

  // Carousel Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Actual Articles
  useEffect(() => {
    async function fetchRecentArticles() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/articles`);
        const data = await res.json();
        
        if (data.success) {
          // Take the first 3 articles
          setArticles(data.data.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch recent articles:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentArticles();
  }, []);

  return (
    <div className={styles.container}>
      
      {/* 4. Pass handleSearch to Navbar */}
      <div onClick={handleSearch}>
<Navbar   />
      </div>
      

      {/* Hero Section */}
      <div className={styles.hero}>
        {heroImages.map((imgUrl, index) => (
          <img
            key={index}
            src={imgUrl}
            alt="Carousel Slide"
            className={`${styles.carouselImage} ${index === currentImageIndex ? styles.carouselImageActive : ""}`}
          />
        ))}
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Welcome to Wiki<span>NITT</span>
          </h1>
          <p className={styles.heroSubtitle}>
            The comprehensive, student-maintained encyclopedia for NIT Trichy.
          </p>
          <div className={styles.heroButtons}>
             <Link href="/articles" className={styles.btnPrimary}>Browse Articles</Link>
             <Link href="/add-article" className={styles.btnSecondary}>Contribute</Link>
          </div>
        </div>
      </div>

      {/* Recent Posts Section */}
      <main className={styles.mainContent}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Recent Updates</h2>
            <p className={styles.sectionDesc}>Latest additions to the knowledge base.</p>
          </div>
          <Link href="/articles" className={styles.viewAll}>
            View all articles →
          </Link>
        </div>

        {loading && <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Loading updates...</p>}

        {!loading && (
          <div className={styles.grid}>
            {articles.map((article) => (
              /* 5. Wrap entire card in Link */
              <Link 
                href={`/article/${article.slug}`} 
                key={article._id} 
                className={styles.card}
              >
                {/* Image or Placeholder */}
                <div className={styles.cardImage}>
                  {article.image ? (
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span className={styles.cardPlaceholder}>
                      {article.title.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.cardCategory}>{article.category}</div>
                  <h3 className={styles.cardTitle}>{article.title}</h3>
                  <p className={styles.cardExcerpt}>
                    {article.description.length > 100 
                      ? article.description.substring(0, 100) + "..." 
                      : article.description}
                  </p>
                  
                  {/* Changed from Link to span to avoid nested <a> tags */}
                  <span className={styles.readMore}>
                    Read More 
                    <svg style={{ width: '16px', marginLeft: '4px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </span>
                </div>
              </Link>
            ))}

            {articles.length === 0 && !loading && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                <p>No articles found. Be the first to write one!</p>
                <Link href="/add-article" style={{ color: '#2563eb', fontWeight: 'bold' }}>Write an Article</Link>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p className={styles.footerText}>© 2025 WikiNITT. Built for the community.</p>
      </footer>
    </div>
  );
}