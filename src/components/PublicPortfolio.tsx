"use client";

import React from "react";
import styles from "./Dashboard.module.css";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import BrandingBadge from "./BrandingBadge";
import AnimatedCursor from "./AnimatedCursor";

interface PublicPortfolioProps {
  domain: string;
}

export default function PublicPortfolio({ domain }: PublicPortfolioProps) {
  const router = useRouter();
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/public/portfolio?domain=${domain}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);

          // Record view after data is loaded (to ensure domain is valid)
          fetch('/api/public/view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domain })
          }).catch(console.error);
        }
      } catch (e) {
        console.error("Failed to fetch portfolio data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [domain]);

  React.useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#fff9f0' }}>
        <h1 style={{ color: '#FF5C00', fontFamily: 'Inter, sans-serif' }}>Loading Portfolio...</h1>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#fff9f0' }}>
        <h1 style={{ color: '#FF5C00', fontFamily: 'Inter, sans-serif' }}>Portfolio Not Found</h1>
      </div>
    );
  }

  const { user, works, testimonials, experiences } = data;
  const motionTransform = user.backgroundMotion ? `scale(${1.1 + scrollY * 0.0004})` : 'scale(1)';

  const getCursorStyle = () => {
    if (!user.customCursor || user.customCursor === "default") return "auto";
    const animatedCursors = ["glow", "fluid", "cyber", "trail"];
    if (animatedCursors.includes(user.customCursor)) return "none";
    return `url(/cursors/${user.customCursor}.svg), auto`;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        html, body, * {
          cursor: ${getCursorStyle()} !important;
        }
        a, button, [role="button"], .interactive {
          cursor: ${getCursorStyle()} !important;
        }
      `}} />
      <AnimatedCursor type={user.customCursor} />
      <div className={styles.wrapper}>

      {/* Dynamic Background */}
      {user.background && (
        <div 
          className={styles.backgroundLayer}
          style={{ 
            backgroundImage: `url(${user.background})`,
            filter: `blur(${user.backgroundBlur}px)`,
            transform: motionTransform,
          }}
        />
      )}
      <div className={styles.container}>
        {/* Header / Nav */}
        <header className={styles.nav}>
          <div className={styles.logo}>
            <img src="/Designly.png" alt="Designly" width="120" height="40" />
          </div>
          <div className={styles.navRight}>
             {user.contactEmail && <a href={`mailto:${user.contactEmail}`} className={styles.launchBtn} style={{ textDecoration: 'none' }}>Work with me</a>}
          </div>
        </header>

        <main className={styles.content}>
          {/* Profile Section */}
          <section className={styles.sectionCard}>
            <div className={styles.profileMain}>
              <div className={`${styles.mainAvatar} ${styles.animatedAvatar}`}>
                <img src={user.image || "/A1.png"} alt={user.name} />
              </div>
              <div className={styles.info}>
                <div className={styles.nameRow}>
                  <h1 className={styles.name}>{user.name}</h1>
                </div>
                <p className={styles.bio}>{user.bio || "No bio yet."}</p>
                
                {/* Skills */}
                <div className={styles.tagsContainer}>
                  <div className={styles.tagsTrack}>
                    {[...(user.skills || []), ...(user.skills || [])].map((skill: string, i: number) => (
                      <span key={i} className={styles.tag}>{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Work Section */}
          {works?.length > 0 && (
            <section className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Featured Work</h2>
              </div>
              <div className={styles.projectGrid}>
                {works.map((work: any) => (
                  <div 
                    key={work.id} 
                    className={styles.projectCard} 
                    style={{ cursor: 'pointer' }}
                    onClick={() => router.push(`/${domain}/work/${work.id}`)}
                  >
                    <div className={styles.projectThumb}>
                      <img src={work.image || "/ST1.png"} alt={work.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className={styles.projectInfo}>
                      <div>
                        <h3 className={styles.projectTitle}>{work.title}</h3>
                        <p className={styles.projectSub}>{work.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Experience Section */}
          {experiences?.length > 0 && (
            <section className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Experience</h2>
              </div>
              <div className={styles.experienceList}>
                {experiences.map((exp: any) => (
                  <div key={exp.id} className={styles.experienceItem}>
                    <div className={styles.expDate}>{exp.fromDate} - {exp.currentlyWorking ? "Present" : exp.toDate}</div>
                    <div className={styles.expLogo}><img src="/Bag.png" alt="Work" width="20" height="20" /></div>
                    <div className={styles.expInfo}>
                      <div className={styles.expCompany}>{exp.company}</div>
                      <div className={styles.expRole}>{exp.designation}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Tools Section */}
          {user.tools && (
            <section className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Tools & Stack</h2>
              </div>
              <div className={styles.toolsMarqueeContainer}>
                <div className={styles.toolsMarqueeContent}>
                  {[...JSON.parse(user.tools), ...JSON.parse(user.tools)].map((tool: any, i: number) => (
                    <div key={i} className={styles.toolIcon}>
                      <img src={`https://cdn.simpleicons.org/${tool.slug}`} alt={tool.name} width="32" height="32" />
                      <span style={{ fontSize: '11px', fontWeight: 600 }}>{tool.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Testimonials */}
          {testimonials?.length > 0 && (
            <section className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Testimonials</h2>
              </div>
              <div className={styles.marqueeContainer}>
                <div className={styles.marqueeContent}>
                  {[...testimonials, ...testimonials].map((test: any, i: number) => (
                    <div key={i} className={styles.testimonialCard}>
                       <div className={styles.testimonialAuthor}>
                         <img src={test.image || "/A2.png"} alt={test.name} className={styles.authorThumb} />
                         <div>
                           <div className={styles.authorName}>{test.name}</div>
                           <div className={styles.authorRole}>{test.role}</div>
                         </div>
                       </div>
                       <p className={styles.testimonialText} style={{ marginTop: '15px' }}>"{test.description}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Contact Details / Footer */}
          <footer className={styles.footer}>
            <div className={styles.madeWith}></div>
            <div style={{ marginTop: '10px', display: 'flex', gap: '20px' }}>
               {user.resumeLink && <a href={user.resumeLink} target="_blank" className={styles.contactAction}>Resume</a>}
               {user.socials && <a href={user.socials} target="_blank" className={styles.contactAction}>Socials</a>}
               {user.phoneNumber && <a href={`tel:${user.phoneNumber}`} className={styles.contactAction}>Phone</a>}
            </div>
          </footer>
        </main>
      </div>
    </div>
    <BrandingBadge />
  </>
);
}
