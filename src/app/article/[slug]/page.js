import { notFound } from 'next/navigation';
import Link from 'next/link';
import styles from './article.module.css';
import ShareButtons from './ShareButtons'; // <--- Import the new component

// Helper to fetch data
async function getArticle(slug) {
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
        
        {/* REPLACED: Use the new ShareButtons component here */}
        {/* We pass the article title so it can be pre-filled in the tweet/post */}
        <ShareButtons title={article.title} />

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