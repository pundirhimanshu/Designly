import styles from "./onboard.module.css";
import Image from "next/image";

export default function OnboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      {/* Background Pattern */}
      <div className={styles.bgPattern}>
        {[...Array(16)].map((_, i) => (
          <div key={i} className={styles.patternPill}></div>
        ))}
      </div>
      
      <div className={styles.card}>
        <div className={styles.logo}>
          <Image 
            src="/Designly.png" 
            alt="Designly" 
            width={160} 
            height={60} 
            priority
          />
        </div>
        
        {children}

        <div className={styles.footer}>
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
        </div>
      </div>
    </div>
  );
}
