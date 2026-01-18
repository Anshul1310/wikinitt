"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation"; 
import Navbar from "@/components/navbar/Navbar"; 
import styles from "./articles.module.css";

// --- Static Data for Slides (Optional: You could also fetch this from DB) ---
const featuredSlides = [
  { id: 101, title: "Top 12 study spots in NITT for 2024", category: "Productivity", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80" },
  { id: 102, title: "Festember 2025: What to Expect", category: "Events", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80" },
];

const categories = ["All articles", "Technology", "Design", "Lifestyle", "Business", "Productivity", "Events", "Hostels", "Academics", "Guide"];

function ArticlesContent() {
  const [activeCategory, setActiveCategory] = useState("All articles");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // State for Dynamic Articles
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // URL Search Params Logic
  const searchParams = useSearchParams();

  useEffect(() => {
    const queryFromUrl = searchParams.get('search');
    if (queryFromUrl) {
      setSearchQuery(queryFromUrl);
    }
  }, [searchParams]);

  // Fetch Articles from API
  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch('/api/articles');
        const data = await res.json();
        if (data.success) {
          setArticles(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch articles", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  // Carousel Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === featuredSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.container}>
      <Navbar onSearch={(val) => setSearchQuery(val)} />
      
      <div className={styles.newsLayout}>
        {/* --- Left Column: Main Feed --- */}
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

          <div className={styles.controlsBar} style={{ justifyContent: 'flex-end' }}>
             <div className={styles.filterWrapper}>
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
            {loading ? (
              <p>Loading articles...</p>
            ) : (
              articles
                .filter(a => activeCategory === "All articles" || a.category === activeCategory)
                .filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((article) => (
                <div key={article._id} className={styles.card}>
                  <div className={styles.cardImageWrapper}>
                    {article.image ? <img src={article.image} alt={article.title} style={{width:'100%', height:'100%', objectFit:'cover'}}/> : <span>📄</span>}
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardCategory}>{article.category}</div>
                    <h3 className={styles.cardTitle}>{article.title}</h3>
                    <div className={styles.cardMeta}>{new Date(article.createdAt).toLocaleDateString()}</div>
                  </div>
                  <Link href={`/article/${article.slug}`} style={{position:'absolute', inset:0}}></Link>
                </div>
              ))
            )}
            
            {!loading && articles.length > 0 && articles.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
               <p style={{padding: '20px', color: '#666'}}>No results found for "{searchQuery}"</p>
            )}
          </div>
        </div>

        {/* --- Right Column: Recent Articles Sidebar --- */}
        <aside className={styles.newsSidebar}>
          <div className={styles.sidebarHeader}>
            <div className={styles.liveDot}></div>
            <span className={styles.sidebarTitle}>Top Headlines</span>
          </div>
          <div className={styles.headlineList}>
            {articles.slice(0, 5).map((article) => (
              <Link 
                key={article._id} 
                href={`/article/${article.slug}`} 
                className={styles.headlineItem}
              >
                <span className={styles.headlineTime}>{new Date(article.createdAt).toLocaleDateString()}</span>
                <span className={styles.headlineTitle}>{article.title}</span>
              </Link>
            ))}
          </div>
        </aside>

      </div>
    </div>
  );
}

export default function ArticlesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArticlesContent />
    </Suspense>
  );
}