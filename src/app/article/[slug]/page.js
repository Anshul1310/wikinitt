// app/article/[slug]/page.jsx
import { notFound } from 'next/navigation';
import styles from './article.module.css';

export default function ArticlePage({ params }) {
  // const article = getArticle(params.slug);

   const article={
    slug: "spotify-design-podcast",
    title: "How They Did It: First Spotify Design Podcast",
    // In a real app, put images in the /public folder
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=2670&auto=format&fit=crop", 
    content: `
      <p>Co-produced by Shamik Ray, Principal Designer and Eda Yu, UX Writer, Past Lives was a new, exciting project to work on. With the help of Maggie Zhang as project manager, we navigated creating our first-ever podcast for Spotify.Design.</p>
      <p>We also used Spotify tools, skilling up on Soundtrap and Anchor from scratch and using them for different parts of the process from recording to distribution, which helped turn our podcast dream into a reality.</p>
      <p>The idea for the series first came to Shamik early this year. He wanted to explore what people on our design team did before joining the tech industry. Our core goal on Spotify.Design is to raise up and amplify individuals in our design org.</p>
    `
  }
  if (!article) {
    notFound();
  }

  return (
    <main className={styles.container}>
      
      {/* Hero Image */}
      <div className={styles.heroSection}>
        <img 
          src={article.image} 
          alt={article.title} 
          className={styles.heroImage}
        />
      </div>

      <div className={styles.mainLayout}>
        
        {/* Left Sidebar with SVG Icons */}
        <aside className={styles.sidebar}>
          <span className={styles.shareLabel}>Share</span>
          
          {/* Twitter Icon */}
          <a href="#" className={styles.socialIcon} aria-label="Share on Twitter">
             <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
          </a>

          {/* Facebook Icon */}
          <a href="#" className={styles.socialIcon} aria-label="Share on Facebook">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>

          {/* LinkedIn Icon */}
          <a href="#" className={styles.socialIcon} aria-label="Share on LinkedIn">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
          
          {/* Instagram Icon */}
           <a href="#" className={styles.socialIcon} aria-label="Share on Instagram">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
        </aside>

        {/* Main Content */}
        <article className={styles.contentArea}>
          <h1 className={styles.title}>
            {article.title}
          </h1>

          {/* Optional: Add a small author/role line if needed */}
          <div className={styles.metaData}>
             By <strong>Shamik Ray</strong> &bull; Principal Designer
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