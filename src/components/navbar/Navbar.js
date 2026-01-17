"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation"; // Import Hooks
import styles from "./navbar.module.css";

export default function Navbar({ onSearch }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [inputValue, setInputValue] = useState(""); // Local state for input
  const router = useRouter();
  const pathname = usePathname();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // If we are already on the Articles page, search immediately (Real-time)
    if (pathname === '/articles' && onSearch) {
      onSearch(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // If on Homepage (or any other page), Redirect to Articles page
      if (pathname !== '/articles') {
        router.push(`/articles?search=${encodeURIComponent(inputValue)}`);
      }
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          Wiki<span>NITT</span>
        </Link>

        {/* Desktop Links */}
        <div className={styles.navLinks}>
          {['Home', 'Departments', 'Hostels', 'Student Life', 'Admin'].map((item) => (
            <Link 
              key={item} 
              href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`} 
              className={styles.navLink}
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Search Section */}
        <div className={styles.searchWrapper}>
          <div className={`${styles.searchForm} ${isSearchOpen ? styles.mobileOpen : ''}`}>
            <div className={styles.inputIcon}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search... (Press Enter)"
              className={styles.searchInput}
              value={inputValue}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown} // Listen for Enter key
            />
            
            <button 
              className={styles.closeSearchBtn}
              onClick={() => setIsSearchOpen(false)}
            >
              ✕
            </button>
          </div>

          <button 
            className={styles.mobileSearchTrigger}
            onClick={() => setIsSearchOpen(true)}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}