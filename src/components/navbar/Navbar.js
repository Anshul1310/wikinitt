"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation"; 
import styles from "./navbar.module.css";

export default function Navbar({ onSearch }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [inputValue, setInputValue] = useState(""); 
  const router = useRouter();
  const pathname = usePathname();

  // UPDATED: Handle click on the search wrapper
  const handleSearchClick = () => {
    // If user is on Home page, redirect to Articles page immediately
    if (pathname === '/') {
      router.push('/articles');
    }
    // If on /articles, do nothing (let the input get focus so user can type)
  };

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
      // If on any page other than /articles, Redirect with the query
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
          {['Home', 'Department', 'Hostel', 'StudentLife', 'Admin'].map((item) => {
            // Helper to determine href based on item name
            let href = '/';
            if (item === 'Admin') href = '/add-article';
            else if (item === 'Department') href = '/article/nitt-department-locations-map';
            else if (item === 'StudentLife') href = '/article/nitt-boys-hostels-guide';
            else if (item === 'Hostel') href = '/articles?category=Hostels'; // Fixed Hostel Link
            
            return (
              <Link 
                key={item} 
                href={href} 
                className={styles.navLink}
              >
                {item}
              </Link>
            );
          })}
        </div>

        {/* Search Section */}
        {/* Added onClick handler to the wrapper */}
        <div onClick={handleSearchClick} className={styles.searchWrapper}>
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
              onKeyDown={handleKeyDown} 
            />
            
            <button 
              className={styles.closeSearchBtn}
              onClick={(e) => {
                e.stopPropagation(); // Prevent wrapper click logic
                setIsSearchOpen(false);
              }}
            >
              ✕
            </button>
          </div>

          <button 
            className={styles.mobileSearchTrigger}
            onClick={(e) => {
              e.stopPropagation(); 
              setIsSearchOpen(true);
            }}
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