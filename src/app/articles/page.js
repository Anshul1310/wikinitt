"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation"; // Import this
import Navbar from "@/components/navbar/Navbar"; 
import styles from "./articles.module.css";

// --- Data ---
const featuredSlides = [
  { id: 101, title: "Top 12 study spots in NITT for 2024", category: "Productivity", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80" },
  { id: 102, title: "Festember 2025: What to Expect", category: "Events", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80" },
];

const allArticles = [
  { id: 1, title: "Problem-solving activities for your team", category: "Collaboration", time: "2h ago" },
  { id: 2, title: "Boost productivity with Kanban", category: "Productivity", time: "4h ago" },
  { id: 3, title: "Ultimate guide to NITT Hostels", category: "Hostels", time: "1d ago" },
  { id: 4, title: "Understanding the credit system", category: "Academics", time: "2d ago" },
  { id: 5, title: "Best food spots inside campus", category: "Lifestyle", time: "2d ago" },
  { id: 6, title: "Surviving the first year", category: "Guide", time: "3d ago" },
];

const categories = ["All articles", "Productivity", "Events", "Hostels", "Academics", "Lifestyle", "Guide"];

// Create a component for the content content to use SearchParams
function ArticlesContent() {
  const [activeCategory, setActiveCategory] = useState("All articles");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // URL Search Params Logic
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if there is a 'search' query in the URL (e.g., ?search=Hostel)
    const queryFromUrl = searchParams.get('search');
    if (queryFromUrl) {
      setSearchQuery(queryFromUrl);
    }
  }, [searchParams]);

  // Carousel Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === featuredSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.container}>
      {/* Navbar with Real-time search callback */}
      <Navbar onSearch={(val) => setSearchQuery(val)} />
      
      {/* Force the input to show the query if redirected */}
      {/* Note: The Navbar component manages its own input state, so visually it might be empty initially on redirect, 
          but the results below WILL be filtered correctly. */}

      {/* <div className={styles.headerSection}>
        <h1 className={styles.pageTitle}>WikiNITT News</h1>
      </div> */}

      <div className={styles.newsLayout}>
        <div className={styles.mainFeed}>
          
          <div className={styles.carouselContainer}>
            <div className={styles.carouselTrack} style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {featuredSlides.map((slide) => (
                <div key={slide.id} className={styles.carouselSlide}>
                  <img src={slide.image} alt={slide.title} className={styles.slideImage} />
                  <div className={styles.slideOverlay}>
                    <div className={styles.slideCategory}>{slide.category}</div>
                    <h2 className={styles.slideTitle}>{slide.title}</h2>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Bar (Search removed as it's now in Navbar) */}
          <div className={styles.controlsBar} style={{ justifyContent: 'flex-end' }}>
             <div className={styles.filterWrapper}>
                {/* Simplified filter for demo */}
                <select 
                  className={styles.filterBtn} 
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
             </div>
          </div>

          <div className={styles.grid}>
            {allArticles
              .filter(a => activeCategory === "All articles" || a.category === activeCategory)
              .filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((article) => (
              <div key={article.id} className={styles.card}>
                <div className={styles.cardImageWrapper}><span>📄</span></div>
                <div className={styles.cardContent}>
                  <div className={styles.cardCategory}>{article.category}</div>
                  <h3 className={styles.cardTitle}>{article.title}</h3>
                  <div className={styles.cardMeta}>{article.time}</div>
                </div>
                <Link href={`/wiki/${article.title.toLowerCase().replace(/ /g, "-")}`} style={{position:'absolute', inset:0}}></Link>
              </div>
            ))}
            {/* Show message if no results */}
            {allArticles.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
               <p style={{padding: '20px', color: '#666'}}>No results found for "{searchQuery}"</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Page Component wrapping Content in Suspense (Required for useSearchParams in Next.js app router)
export default function ArticlesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArticlesContent />
    </Suspense>
  );
}