"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./home.module.css";

// Carousel Images (NIT Trichy & Academic themed wallpapers)
const heroImages = [
  "https://upload.wikimedia.org/wikipedia/commons/5/53/NITT_Admin_Block.jpg", // NITT Admin Block
  "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1920&q=80", // Campus Vibe
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80", // Library/Study Vibe
];

// Dummy Data for cards
const recentArticles = [
  {
    id: 1,
    title: "Festember",
    category: "Student Life",
    excerpt: "The annual cultural festival of NIT Trichy, known for its diverse events and massive footfall.",
  },
  {
    id: 2,
    title: "Computer Science Dept",
    category: "Departments",
    excerpt: "Established in 1980, the CSE department is one of the most sought-after branches.",
  },
  {
    id: 3,
    title: "Opal Hostel",
    category: "Hostels",
    excerpt: "The primary ladies' hostel providing accommodation for undergraduate students.",
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // --- Carousel Logic ---
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className={styles.container}>
      
      {/* Navigation */}
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <div className={styles.logo}>
            Wiki<span>NITT</span>
          </div>
          <div className={styles.navLinks}>
            {['Home', 'Departments', 'Hostels', 'Student Life', 'Admin'].map((item) => (
              <Link 
                key={item} 
                href={`/${item.toLowerCase().replace(' ', '-')}`} 
                className={styles.navLink}
              >
                {item}
              </Link>
            ))}
          </div>
          <div className={styles.searchContainer}>
            <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </nav>

      {/* Hero Section with Carousel */}
      <div className={styles.hero}>
        
        {/* Render All Images (Controlled by CSS opacity) */}
        {heroImages.map((imgUrl, index) => (
          <img
            key={index}
            src={imgUrl}
            alt={`Slide ${index + 1}`}
            className={`${styles.carouselImage} ${
              index === currentImageIndex ? styles.carouselImageActive : ""
            }`}
          />
        ))}

        {/* Gradient Overlay */}
        <div className={styles.heroOverlay}></div>

        {/* Text Content */}
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Welcome to Wiki<span>NITT</span>
          </h1>
          <p className={styles.heroSubtitle}>
            The comprehensive, student-maintained encyclopedia for NIT Trichy.
          </p>
          <div className={styles.heroButtons}>
             <button className={styles.btnPrimary}>Browse Articles</button>
             <button className={styles.btnSecondary}>Contribute</button>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <main className={styles.mainContent}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Recent Updates</h2>
            <p className={styles.sectionDesc}>Latest additions to the knowledge base.</p>
          </div>
          <Link href="/all" className={styles.viewAll}>
            View all articles →
          </Link>
        </div>

        <div className={styles.grid}>
          {recentArticles.map((article) => (
            <div key={article.id} className={styles.card}>
              <div className={styles.cardImage}>
                <span className={styles.cardPlaceholder}>{article.title[0]}</span>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardCategory}>{article.category}</div>
                <h3 className={styles.cardTitle}>{article.title}</h3>
                <p className={styles.cardExcerpt}>{article.excerpt}</p>
                <Link 
                  href={`/wiki/${article.title.toLowerCase().replace(" ", "-")}`} 
                  className={styles.readMore}
                >
                  Read More 
                  <svg style={{ width: '16px', marginLeft: '4px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p className={styles.footerText}>© 2024 WikiNITT. Built for the community.</p>
      </footer>
    </div>
  );
}