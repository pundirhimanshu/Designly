"use client";

import React from "react";
import styles from "./CaseStudyEditor.module.css";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface PublicCaseStudyProps {
  domain: string;
  id: string;
}

export default function PublicCaseStudy({ domain, id }: PublicCaseStudyProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/public/portfolio?domain=${domain}`);
        if (res.ok) {
          const json = await res.json();
          const work = json.works.find((w: any) => w.id === id);
          if (work) {
            // Include user theme info
            setData({ ...work, user: json.user });
          }
        }
      } catch (e) {
        console.error("Failed to fetch case study:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [domain, id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#fff9f0' }}>
        <h1 style={{ color: '#FF5C00', fontFamily: 'Inter, sans-serif' }}>Loading Case Study...</h1>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#fff9f0' }}>
        <h1 style={{ color: '#FF5C00', fontFamily: 'Inter, sans-serif' }}>Case Study Not Found</h1>
      </div>
    );
  }

  const theme = data.user || {};

  return (
    <div 
      className={styles.container} 
      style={{ 
        background: theme.background ? `url(${theme.background}) no-repeat center center fixed` : 'white',
        backgroundSize: 'cover',
        cursor: theme.customCursor ? `url(/cursors/${theme.customCursor}), auto` : 'auto',
        position: 'relative',
        minHeight: '100vh',
        overflowX: 'hidden'
      }}
    >
      {theme.backgroundBlur && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backdropFilter: `blur(${theme.backgroundBlur}px)`,
          zIndex: 0,
          pointerEvents: 'none'
        }} />
      )}

      {theme.backgroundMotion && theme.background && (
        <motion.div
           style={{
             position: 'fixed',
             inset: '-10%',
             backgroundImage: `url(${theme.background})`,
             backgroundSize: 'cover',
             backgroundPosition: 'center',
             zIndex: -1,
           }}
           animate={{
             scale: [1, 1.05, 1],
           }}
           transition={{
             duration: 20,
             repeat: Infinity,
             ease: "linear"
           }}
        />
      )}

      <div style={{ position: 'relative', zIndex: 1, padding: '20px' }}>
        <header className={styles.header}>
          <button className={styles.goBack} onClick={() => router.back()}>
            <ArrowLeft size={16} />
            Go Back
          </button>
        </header>

        <main className={styles.content}>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.9)', 
            backdropFilter: 'blur(10px)',
            padding: '40px', 
            borderRadius: '24px', 
            marginBottom: '40px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.05)'
          }}>
            <h1 className={styles.titleInput} style={{ border: 'none', background: 'transparent' }}>{data.title}</h1>
            <p className={styles.subtitleInput} style={{ border: 'none', background: 'transparent', whiteSpace: 'pre-wrap' }}>{data.description}</p>

            <div className={styles.metaGrid}>
              <div className={styles.metaItem}>
                <label className={styles.metaLabel}>App name / Client</label>
                <div className={styles.metaInput}>{data.client || "Not specified"}</div>
              </div>
              <div className={styles.metaItem}>
                <label className={styles.metaLabel}>My Role</label>
                <div className={styles.metaInput}>{data.role || "Not specified"}</div>
              </div>
              <div className={styles.metaItem}>
                <label className={styles.metaLabel}>Industry</label>
                <div className={styles.metaInput}>{data.industry || "Not specified"}</div>
              </div>
              <div className={styles.metaItem}>
                <label className={styles.metaLabel}>Platform</label>
                <div className={styles.metaInput}>{data.platform || "Not specified"}</div>
              </div>
            </div>
          </div>

          <section className={styles.imageSection}>
            <img src={data.image || "/ST1.png"} alt={data.title} className={styles.mainImage} />
          </section>

          <section className={styles.richContent} style={{ 
            background: 'rgba(255, 255, 255, 0.9)', 
            backdropFilter: 'blur(10px)',
            padding: '40px', 
            borderRadius: '24px', 
            marginTop: '40px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.05)'
          }}>
             <div 
               className={styles.editableContent} 
               style={{ border: 'none', background: 'transparent' }}
               dangerouslySetInnerHTML={{ __html: data.content || "No details available." }}
             />
          </section>
        </main>
      </div>
    </div>
  );
}
