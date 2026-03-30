"use client";

import Link from "next/link";
import styles from "./page.module.css";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Dashboard from "../components/Dashboard";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#fff9f0' }}>
        <h1 style={{ color: '#FF5C00', fontFamily: 'Inter, sans-serif' }}>Loading your portfolio...</h1>
      </div>
    );
  }

  if (status === "authenticated") {
    return <Dashboard />;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <div className={styles.logo}>
            <img src="/Designly.png" alt="Designly" width="120" height="40" />
          </div>
          <div className={styles.navLinks}>
            <Link href="/login" className={styles.loginLink}>Login</Link>
            <Link href="/signup" className={styles.btnBlack}>Build your portfolio</Link>
          </div>
        </nav>
      </header>

      <main className={styles.hero}>
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

        <h1 className={styles.title}>
          Design your story. Showcase your work with designly.
        </h1>



        {/* Floating Avatars */}
        <div className={`${styles.avatar} ${styles.avatar1}`}>
          <img src="/A1.png" alt="Avatar 1" width="80" height="80" />
        </div>
        <div className={`${styles.avatar} ${styles.avatar2}`}>
          <img src="/A2.png" alt="Avatar 2" width="70" height="70" />
        </div>
        <div className={`${styles.avatar} ${styles.avatar3}`}>
          <img src="/A3.png" alt="Avatar 3" width="60" height="60" />
        </div>
        <div className={`${styles.avatar} ${styles.avatar4}`}>
          <img src="/A4.png" alt="Avatar 4" width="65" height="65" />
        </div>
      </main>

      <section className={styles.stepsSection}>
        <div className={styles.stepsHeader}>
          <h2 className={styles.stepsTitle}>Portfolio ready in 4 steps.</h2>
          <p className={styles.stepsSubtitle}>Most Easy way to Create and showcase your work</p>
        </div>

        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepImageContainer}>
              <img src="/ST1.png" alt="Step 1" className={styles.stepImage} />
            </div>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepImageContainer}>
              <img src="/ST2.png" alt="Step 2" className={styles.stepImage} />
            </div>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepImageContainer}>
              <img src="/ST3.png" alt="Step 3" className={styles.stepImage} />
            </div>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepImageContainer}>
              <img src="/ST4.png" alt="Step 4" className={styles.stepImage} />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.whySection}>
        <h2>Why Designly is the best portfolio builder</h2>
        
        <div className={styles.dottedContainer}>
          <div className={styles.pillsGrid}>
            <div className={`${styles.pill} ${styles.pillOrange}`}>No Need to learn Tools</div>
            <div className={`${styles.pill} ${styles.pillBlue}`}>Still fighting with vibe coding</div>
            <div className={`${styles.pill} ${styles.pillPurple}`}>Build portfolio in just 4 steps</div>
            <div className={`${styles.pill} ${styles.pillPink}`}>Within the seconds you can share your work</div>
          </div>
        </div>
      </section>

      <section className={styles.finalSection}>
        <h2 className={styles.finalTitle}>Just Go... and Create Now</h2>

      </section>
    </div>
  );
}
