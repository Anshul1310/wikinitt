"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "@/components/navbar/Navbar"; // Use the reusable component
import styles from "./home.module.css";

// Carousel Images
const heroImages = [
  "https://upload.wikimedia.org/wikipedia/commons/5/53/NITT_Admin_Block.jpg", 
  "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80", 
];

const recentArticles = [
  { id: 1, title: "Festember", category: "Student Life", excerpt: "The annual cultural festival of NIT Trichy." },
  { id: 2, title: "Computer Science Dept", category: "Departments", excerpt: "Established in 1980, the CSE department." },
  { id: 3, title: "Opal Hostel", category: "Hostels", excerpt: "The primary ladies' hostel." },
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      
      {/* 1. Use the Navbar Component */}
      {/* Note: We don't need onSearch here because the Navbar handles the redirect automatically on '/' */}
      <Navbar />

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
          <Link href="/articles" className={styles.viewAll}>
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

      <footer className={styles.footer}>
        <p className={styles.footerText}>© 2024 WikiNITT. Built for the community.</p>
      </footer>
    </div>
  );
}