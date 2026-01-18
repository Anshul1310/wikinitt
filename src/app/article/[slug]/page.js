// app/article/[slug]/page.jsx
import { notFound } from 'next/navigation';
import Link from 'next/link'; // Import Link
import styles from './article.module.css';

// Helper to fetch data
async function getArticle(slug) {
  // Use environment variable or fallback to localhost:5000 for backend
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  
  try {
    const res = await fetch(`${apiUrl}/api/articles/${slug}`, {
      cache: 'no-store' 
    });
    
    if (!res.ok) return null;
    
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className={styles.container}>
      
      {/* Hero Image */}
      {article.image && (
        <div className={styles.heroSection}>
          <img 
            src={article.image} 
            alt={article.title} 
            className={styles.heroImage}
          />
        </div>
      )}

      <div className={styles.mainLayout}>
        
        {/* Left Sidebar (Sticky Socials) */}
        <aside className={styles.sidebar}>
          <span className={styles.shareLabel}>Share</span>
          
          <a href="#" className={styles.socialIcon} aria-label="Share on Twitter">
             <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
          </a>
          <a href="#" className={styles.socialIcon} aria-label="Share on Facebook">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>
          <a href="#" className={styles.socialIcon} aria-label="Share on LinkedIn">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
        </aside>

        {/* Main Content */}
        <article className={styles.contentArea}>
          
          <Link href="/articles" className={styles.backLink}>
            ← Back to Articles
          </Link>

          <h1 className={styles.title}>
            {article.title}
          </h1>

          <div className={styles.metaData}>
             <span className={styles.categoryTag}>{article.category}</span>
             <span>{new Date(article.createdAt).toLocaleDateString()}</span>
          </div>

          <div 
            className={styles.bodyText}
            dangerouslySetInnerHTML={{ __html: article.content }} 
          />
        </article>

      </div>
    </main>
  );
}