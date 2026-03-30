"use client";

import styles from "./AuthLayout.module.css";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function AuthLayout({ children, footer }: AuthLayoutProps) {
  return (
    <div className={styles.container}>
      {/* Background Pattern */}
      <div className={styles.bgPattern}>
        {[...Array(16)].map((_, i) => (
          <div key={i} className={styles.patternPill}></div>
        ))}
      </div>

      {/* Auth Card */}
      <div className={styles.card}>
        <div className={styles.logo}>
          <Link href="/">
            <img src="/Designly.png" alt="Designly" width="160" height="54" />
          </Link>
        </div>
        
        <h1 className={styles.title}>Welcome to Designly</h1>
        
        {children}

        <div className={styles.badge}>
          <span role="img" aria-label="thumbs up">👍</span>
          <span style={{ marginLeft: '8px' }}>BEST FOR</span>
          <div className={styles.roleScroller}>
            <div className={styles.roleWrapper}>
              <div>DESIGNERS</div>
              <div>PRODUCT MANAGERS</div>
              <div>ENGINEERS</div>
            </div>
          </div>
        </div>

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
}
