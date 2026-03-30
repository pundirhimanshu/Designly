"use client";

import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import { BRAND_COLORS } from '@/constants/brandColors';
import { 
  Plus, 
  Trash2, 
  Quote, 
  ChevronLeft, 
  ChevronRight, 
  Building2,
  Settings,
  LogOut,
  Palette,
  BarChart3,
  Eye,
  Pencil
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import ThemeDrawer from "./ThemeDrawer";
import WorkEditModal from "./WorkEditModal";
import TestimonialModal from "./TestimonialModal";
import ExperienceModal from "./ExperienceModal";
import ProfileEditModal from "./ProfileEditModal";
import ContactModal from "./ContactModal";
import ToolsModal from "./ToolsModal";
import LaunchModal from "./LaunchModal";
import SettingsModal from "./SettingsModal";
import BrandingBadge from "./BrandingBadge";
import AnimatedCursor from "./AnimatedCursor";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [imgSrc, setImgSrc] = React.useState<string>("/A1.png");
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isAddWorkModalOpen, setIsAddWorkModalOpen] = React.useState(false);
  const [works, setWorks] = React.useState<any[]>([]);
  const [hiddenWorkIds, setHiddenWorkIds] = React.useState<string[]>([]);
  const [testimonials, setTestimonials] = React.useState<any[]>([]);
  const [hiddenTestimonialIds, setHiddenTestimonialIds] = React.useState<string[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Load hidden IDs from localStorage once on mount
  React.useEffect(() => {
    const savedWorks = localStorage.getItem("hidden_work_ids");
    const savedTestimonials = localStorage.getItem("hidden_testimonial_ids");
    if (savedWorks) {
      try {
        setHiddenWorkIds(JSON.parse(savedWorks));
      } catch (e) { console.error(e); }
    }
    if (savedTestimonials) {
      try {
        setHiddenTestimonialIds(JSON.parse(savedTestimonials));
      } catch (e) { console.error(e); }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change, but only after initial load
  React.useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("hidden_work_ids", JSON.stringify(hiddenWorkIds));
    }
  }, [hiddenWorkIds, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("hidden_testimonial_ids", JSON.stringify(hiddenTestimonialIds));
    }
  }, [hiddenTestimonialIds, isLoaded]);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [editingExperience, setEditingExperience] = useState<any>(null);
  const [userTools, setUserTools] = useState<{ name: string; slug: string }[]>([]);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isToolsModalOpen, setIsToolsModalOpen] = useState(false);
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [contactDetails, setContactDetails] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isThemeDrawerOpen, setIsThemeDrawerOpen] = useState(false);
  const [domain, setDomain] = useState<string | null>(null);
  const [background, setBackground] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolioBackground');
      if (saved) return saved === "none" || saved === "" ? null : saved;
    }
    return (session?.user as any)?.background || null;
  });

  const [blur, setBlur] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolioBlur');
      if (saved) return parseInt(saved);
    }
    return session?.user?.backgroundBlur || 0;
  });

  const [motion, setMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolioMotion');
      if (saved) return saved === "true";
    }
    return session?.user?.backgroundMotion || false;
  });

  const [cursor, setCursor] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolioCursor');
      if (saved) return saved;
    }
    return (session?.user as any)?.customCursor || "default";
  });

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/background/get");
        const data = await res.json();
        if (data.background !== undefined) setBackground(data.background === "none" ? null : data.background);
        if (data.blur !== undefined) setBlur(data.blur);
        if (data.motion !== undefined) setMotion(data.motion);
        if (data.cursor !== undefined) setCursor(data.cursor);
      } catch (e) { console.error("Failed to fetch background settings:", e); }
    };

    if (typeof window !== 'undefined') {
      const savedBg = localStorage.getItem('portfolioBackground');
      const savedBlur = localStorage.getItem('portfolioBlur');
      const savedMotion = localStorage.getItem('portfolioMotion');
      const savedCursor = localStorage.getItem('portfolioCursor');

      // Helper to safely get session user values
      const sessionUser = session?.user as any;

      if (savedBg) {
        setBackground(savedBg === "none" || savedBg === "" ? null : savedBg);
      } else if (sessionUser?.background) {
        setBackground(sessionUser.background);
      }

      if (savedBlur) {
        setBlur(parseInt(savedBlur));
      } else if (sessionUser?.backgroundBlur !== undefined) {
        setBlur(sessionUser.backgroundBlur);
      }

      if (savedMotion) {
        setMotion(savedMotion === "true");
      } else if (sessionUser?.backgroundMotion !== undefined) {
        setMotion(sessionUser.backgroundMotion);
      }

      if (savedCursor) {
        setCursor(savedCursor);
      } else if (sessionUser?.customCursor) {
        setCursor(sessionUser.customCursor);
      }

      // Always fetch latest from DB to ensure sync
      if (session) fetchSettings();
    }
  }, [session]);

  // Scroll listener for motion effect
  React.useEffect(() => {
    if (!motion) {
      setScrollY(0);
      return;
    }

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [motion]);

  const fetchWorks = React.useCallback(async () => {
    try {
      const res = await fetch("/api/work/list", { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setWorks(data.works || []);
      }
    } catch (e) { console.error(e); }
  }, []);

  const handleDeleteWork = async (id: string) => {
    if (!confirm("Are you sure you want to delete this work?")) return;
    
    // Optimistic hide
    setHiddenWorkIds(prev => [...prev, id]);

    try {
      const res = await fetch("/api/work/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        fetchWorks();
      } else {
        // If it failed and it's not a dummy ID, restore it
        if (!id.startsWith('def')) {
          setHiddenWorkIds(prev => prev.filter(hid => hid !== id));
          const data = await res.json();
          alert(data.error || "Failed to delete from server");
        }
      }
    } catch (e) { 
      console.error(e);
      setHiddenWorkIds(prev => prev.filter(hid => hid !== id));
    }
  };

  const fetchTestimonials = React.useCallback(async () => {
    try {
      const res = await fetch("/api/testimonials/list", { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data.testimonials || []);
      }
    } catch (e) { console.error(e); }
  }, []);

  const fetchExperiences = React.useCallback(async () => {
    try {
      const res = await fetch("/api/experience/list", { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setExperiences(data.experiences || []);
      }
    } catch (e) { console.error(e); }
  }, []);

  const fetchTools = React.useCallback(async () => {
    try {
      const res = await fetch("/api/tools/list", { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setUserTools(data.tools || []);
      }
    } catch (e) { console.error(e); }
  }, []);

  const fetchContact = React.useCallback(async () => {
    try {
      const res = await fetch("/api/contact/get", { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setContactDetails(data.contact || null);
      }
    } catch (e) { console.error(e); }
  }, []);

  const fetchBackground = React.useCallback(async () => {
    try {
      const res = await fetch("/api/background/get", { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setBackground(data.background || null);
        if (data.blur !== undefined) setBlur(data.blur);
        if (data.motion !== undefined) setMotion(data.motion);
        
        localStorage.setItem('portfolioBackground', data.background || "none");
        localStorage.setItem('portfolioBlur', (data.blur || 0).toString());
        localStorage.setItem('portfolioMotion', (data.motion || false).toString());
      }
    } catch (e) { console.error(e); }
  }, []);

  const fetchDomain = React.useCallback(async () => {
    try {
      const res = await fetch("/api/domain/get", { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setDomain(data.domain);
      }
    } catch (e) { console.error(e); }
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/user/status");
      const data = await res.json();
      if (data.updatedAt) {
        setLastUpdated(data.updatedAt);
      }
    } catch (e) {
      console.error("Failed to fetch status:", e);
    }
  };

  useEffect(() => {
    fetchWorks();
    fetchTestimonials();
    fetchExperiences();
    fetchTools();
    fetchContact();
    fetchStatus();
  }, []);

  React.useEffect(() => {
    if (session) {
      fetchBackground();
      fetchDomain();
    }
  }, [session, fetchWorks, fetchTestimonials, fetchExperiences, fetchTools, fetchContact, fetchBackground, fetchDomain]);

  React.useEffect(() => {
    if (session?.user?.image && session.user.image !== "") {
      setImgSrc(session.user.image);
    } else {
      setImgSrc("/A1.png");
    }
  }, [session]);

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    
    // Optimistic hide
    setHiddenTestimonialIds(prev => [...prev, id]);

    try {
      const res = await fetch("/api/testimonials/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        fetchTestimonials();
      } else {
        // If not a dummy testimonial, restore it
        if (!id.startsWith('t')) {
          setHiddenTestimonialIds(prev => prev.filter(hid => hid !== id));
          const data = await res.json();
          alert(data.error || "Failed to delete");
        }
      }
    } catch (e) {
      console.error("Delete error:", e);
      setHiddenTestimonialIds(prev => prev.filter(hid => hid !== id));
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    try {
      const res = await fetch("/api/experience/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        fetchExperiences();
      }
    } catch (e) {
      console.error("Delete error:", e);
    }
  };

  const formatExpDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    return `${months[parseInt(month, 10) - 1]} ${year}`;
  };

  const testimonialList = (testimonials.length > 0 
    ? testimonials 
    : [
        { id: 't1', name: 'John Doe', role: 'Creative Director', description: 'Working with this designer was an absolute pleasure. They delivered top-notch results within the deadline!', image: null },
        { id: 't2', name: 'Jane Smith', role: 'Product Manager', description: 'Exceptional attention to detail and a deep understanding of user needs. Highly recommended for any design project.', image: null }
      ]).filter((t: any) => !hiddenTestimonialIds.includes(t.id));

  const handleImageError = () => {
    if (imgSrc === session?.user?.image) {
      setImgSrc("/A1.png");
    } else if (imgSrc === "/A1.png") {
      setImgSrc("/A2.png");
    } else if (imgSrc === "/A2.png") {
      setImgSrc("/A3.png");
    }
  };

  const userSkills = (session?.user as any)?.skills?.length > 0 
    ? (session?.user as any).skills 
    : ['Figma', 'UI Design', 'User Research', 'Prototyping', 'Visual Communication'];


  const getCursorStyle = () => {
    if (!cursor || cursor === "default") return "auto";
    const animatedCursors = ["glow", "fluid", "cyber", "trail"];
    if (animatedCursors.includes(cursor)) return "none";
    return `url(/cursors/${cursor}.svg), auto`;
  };

  return (
    <>
      <AnimatedCursor type={cursor} />
      <div className={styles.wrapper} style={{ cursor: getCursorStyle() }}>
        {/* Dynamic Background Layer */}
      {background && (
        <div 
          className={styles.backgroundLayer}
          style={{ 
            backgroundImage: `url(${background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: `blur(${blur}px)`,
            transform: motion ? `scale(${1.1 + scrollY * 0.0004})` : 'scale(1)',
            opacity: 1,
            display: 'block',
            width: 'calc(100% + 40px)',
            height: 'calc(100% + 40px)',
          }}
        />
      )}
      {!background && (
        <div 
          className={styles.backgroundLayer}
          style={{ 
            backgroundColor: '#fff9f0',
            opacity: 1,
            display: 'block',
            width: '100vw',
            height: '100vh',
          }}
        />
      )}
      <div className={styles.container}>
        <div className={styles.content}>
        {/* Navigation */}
        <nav className={styles.nav}>
          <img src="/Designly.png" alt="Designly" width="100" height="34" />
          <div className={styles.navRight}>
            <div className={styles.navIcons}>
              <div 
                className={styles.iconBtn} 
                title="Design"
                onClick={() => setIsThemeDrawerOpen(true)}
              >
                <Palette size={20} color="#666" />
              </div>
              <div 
                className={styles.iconBtn} 
                title="Statistics"
                onClick={() => router.push('/insights')}
              >
                <BarChart3 size={20} color="#666" />
              </div>
              <div 
                className={styles.iconBtn} 
                title="Preview"
                onClick={() => {
                  if (domain) {
                    window.open(`/${domain}`, '_blank');
                  } else {
                    alert("Please register a domain first to preview your portfolio.");
                  }
                }}
              >
                <Eye size={20} color="#666" />
              </div>
              </div>
            <button className={styles.launchBtn} onClick={() => setIsLaunchModalOpen(true)}>Launch</button>
            <div 
              className={styles.userAvatar} 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{ cursor: 'pointer', position: 'relative' }}
            >
              <img 
                src={session?.user?.image || imgSrc} 
                alt="Avatar" 
                width="36" 
                height="36" 
                style={{ borderRadius: '50%' }}
                onError={handleImageError}
              />

              {/* User Dropdown */}
              {isDropdownOpen && (
                <div className={styles.userDropdown} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.dropdownItem} onClick={() => {
                      setIsSettingsModalOpen(true);
                      setIsDropdownOpen(false);
                  }}>
                    <div className={styles.dropdownIcon}>
                      <Settings size={28} />
                    </div>
                    <div className={styles.dropdownText}>
                      <span className={styles.dropdownTitle}>Settings</span>
                      <span className={styles.dropdownSub}>Change domain, Delete account</span>
                    </div>
                  </div>
                  
                  <div 
                    className={`${styles.dropdownItem} ${styles.logoutItem}`}
                    onClick={() => {
                      // Clear ALL local storage on logout for a foolproof clean sync
                      localStorage.clear();
                      signOut({ callbackUrl: '/' });
                    }}
                  >
                    <div className={styles.dropdownIconRed}>
                      <LogOut size={24} color="#FF0000" />
                    </div>
                    <span className={styles.logoutText}>Logout</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Profile Section */}
        <section className={styles.sectionCard}>
          <div className={styles.profileMain}>
            <div className={styles.mainAvatar}>
              <img 
                src={imgSrc} 
                alt="Avatar" 
                className={imgSrc === "/A1.png" || imgSrc === "/A2.png" || imgSrc === "/A3.png" ? styles.animatedAvatar : ""} 
                onError={handleImageError}
                key={`profile-${imgSrc}`}
              />
            </div>
            <div className={styles.info}>
              <div className={styles.nameRow}>
                <h1 className={styles.name}>{session?.user?.name || "User Name"}</h1>
                <div className={styles.editBtn} onClick={() => setIsEditModalOpen(true)}>
                  <Pencil size={14} color="#666" />
                </div>
              </div>
              <p className={styles.bio}>
                {(session?.user as any)?.bio || "Owns the end-to-end user experience — from idea to interface — crafting products that are both functional and delightful."}
              </p>
              <div className={styles.tagsContainer}>
                <div className={styles.tagsTrack}>
                  {userSkills.map((tag: string, idx: number) => (
                    <span key={`${tag}-${idx}`} className={styles.tag}>{tag}</span>
                  ))}
                  {/* Duplicated for infinite loop */}
                  {userSkills.map((tag: string, idx: number) => (
                    <span key={`${tag}-dup-${idx}`} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Profile Edit Modal */}
        {isEditModalOpen && (
          <ProfileEditModal
            initialData={{
              name: session?.user?.name || "",
              bio: (session?.user as any)?.bio || "",
              skills: (session?.user as any)?.skills || [],
              image: session?.user?.image || ""
            }}
            onClose={() => setIsEditModalOpen(false)}
            onSave={(data) => {
              // Update local state if needed, but handled by refresh in modal
            }}
          />
        )}

        {/* Work Section */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>WORK</h3>
            <Plus 
              className={styles.addBtn} 
              size={24} 
              onClick={() => setIsAddWorkModalOpen(true)}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <div className={styles.projectGrid}>
            {(works.length > 0 
              ? works.filter(w => !hiddenWorkIds.includes(w.id))
              : [
                  { id: 'def1', title: 'Case Study 01', description: 'A comprehensive study of user behavior and interface optimization.', image: '/ST3.png' },
                  { id: 'def2', title: 'Case Study 02', description: 'Exploring modern design patterns and their impact on engagement.', image: '/ST4.png' }
                ].filter(w => !hiddenWorkIds.includes(w.id))
            ).map((work: any, i: number) => (
              <div 
                key={work.id || i} 
                className={styles.projectCard} 
                style={{ position: 'relative', cursor: 'pointer' }}
                onClick={() => work.id && !work.id.startsWith('def') && router.push(`/work/${work.id}`)}
              >
                <div 
                  className={`${styles.actionIcon} ${styles.deleteIcon}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteWork(work.id);
                  }}
                  style={{ 
                    position: 'absolute', 
                    top: '12px', 
                    right: '12px', 
                    zIndex: 10,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                  }}
                >
                  <Trash2 size={16} />
                </div>
                <div className={styles.projectThumb}>
                   <img 
                    src={work.image || `/ST${(i % 3) + 3}.png`} 
                    alt={work.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                   />
                   <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(255,255,255,0.9)', padding: '4px 12px', borderRadius: '100px', fontSize: '10px', fontWeight: 'bold' }}>
                      Case Study
                   </div>
                </div>
                <div className={styles.projectInfo}>
                  <div>
                    <h4 className={styles.projectTitle}>{work.title}</h4>
                    <p className={styles.projectSub}>{work.description}</p>
                  </div>
                  <div className={styles.actions}>
                    <div className={`${styles.actionIcon} ${styles.editIconSmall}`}>
                      <Pencil size={14} color="#666" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>TESTIMONIALS</h3>
            <Plus 
              className={styles.addBtn} 
              size={24} 
              onClick={() => {
                setEditingTestimonial(null);
                setIsTestimonialModalOpen(true);
              }}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <div className={styles.marqueeContainer}>
            <div className={styles.marqueeContent}>
              {[...testimonialList, ...testimonialList].map((t: any, i: number) => (
                <div key={t.id ? `${t.id}-${i}` : i} className={styles.testimonialCard}>
                  <Quote className={styles.quoteIcon} size={24} />
                  <p className={styles.testimonialText}>
                    {t.description}
                    <Quote className={styles.quoteIconUpside} size={18} />
                  </p>
                  <div className={styles.testimonialAuthor}>
                    <div className={styles.authorThumb}>
                       <img 
                        src={t.image || `https://avatar.vercel.sh/${t.name || i}`} 
                        alt="Avatar" 
                        style={{ borderRadius: '50%' }} 
                        width="40" 
                        height="40" 
                       />
                    </div>
                    <div>
                      <h5 className={styles.authorName}>{t.name}</h5>
                      <p className={styles.authorRole}>{t.role}</p>
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                      <div 
                        className={styles.editBtn} 
                        onClick={() => {
                          setEditingTestimonial(t);
                          setIsTestimonialModalOpen(true);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <Pencil size={14} color="#666" />
                      </div>
                      {t.id && !t.id.startsWith('t') && (
                        <div 
                          className={styles.editBtn} 
                          onClick={() => handleDeleteTestimonial(t.id)}
                          style={{ cursor: 'pointer', background: '#fff0f0' }}
                        >
                          <Trash2 size={14} color="#ff4d4d" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.navArrows}>
             <div className={styles.arrowBtn}><ChevronLeft size={20} /></div>
             <div className={styles.arrowBtn}><ChevronRight size={20} /></div>
          </div>
        </section>

        {/* Experience */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>EXPERIENCE</h3>
            <Plus 
              className={styles.addBtn} 
              size={24} 
              onClick={() => {
                setEditingExperience(null);
                setIsExperienceModalOpen(true);
              }}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <div className={styles.experienceList}>
            {(experiences.length > 0 
              ? experiences 
              : [
                  { id: 'def1', company: 'Company Name', designation: 'Your Role', fromDate: '2022-03', toDate: '2025-06', currentlyWorking: false },
                  { id: 'def2', company: 'Company Name', designation: 'Your Role', fromDate: '2020-01', toDate: '2022-02', currentlyWorking: false }
                ]
            ).map((exp: any, i: number) => (
              <div key={exp.id || i} className={styles.experienceItem}>
                <span className={styles.expDate}>
                  {formatExpDate(exp.fromDate)} - {exp.currentlyWorking ? 'PRESENT' : formatExpDate(exp.toDate)}
                </span>
                <div className={styles.expLogo}>
                   <Building2 size={24} color="#666" />
                </div>
                <div className={styles.expInfo}>
                   <h5 className={styles.expCompany}>{exp.company}</h5>
                   <p className={styles.expRole}>{exp.designation}</p>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                  <div 
                    className={styles.editBtn} 
                    onClick={() => {
                      if (exp.id && !exp.id.startsWith('def')) {
                        setEditingExperience(exp);
                      } else {
                        setEditingExperience(null);
                      }
                      setIsExperienceModalOpen(true);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <Pencil size={14} color="#666" />
                  </div>
                  {exp.id && !exp.id.startsWith('def') && (
                    <div 
                      className={styles.editBtn} 
                      onClick={() => handleDeleteExperience(exp.id)}
                      style={{ cursor: 'pointer', background: '#fff0f0' }}
                    >
                      <Trash2 size={14} color="#ff4d4d" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tools */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>TOOLS</h3>
            <Plus 
              className={styles.addBtn} 
              size={24} 
              onClick={() => setIsToolsModalOpen(true)}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <div className={styles.toolsMarqueeContainer}>
            <div className={styles.toolsMarqueeContent}>
              {(userTools.length > 0 ? [...userTools, ...userTools] : [
                { name: 'Figma', slug: 'figma' },
                { name: 'Sketch', slug: 'sketch' },
                { name: 'VS Code', slug: 'visualstudiocode' },
                { name: 'React', slug: 'react' },
                { name: 'GitHub', slug: 'github' },
                { name: 'Figma', slug: 'figma' },
                { name: 'Sketch', slug: 'sketch' },
                { name: 'VS Code', slug: 'visualstudiocode' },
                { name: 'React', slug: 'react' },
                { name: 'GitHub', slug: 'github' },
              ]).map((tool: any, idx: number) => (
                <div key={`${tool.slug}-${idx}`} className={styles.toolIcon} title={tool.name}>
                  <img 
                    src={`https://api.iconify.design/simple-icons:${tool.slug}.svg?color=${encodeURIComponent(BRAND_COLORS[tool.slug] || '#111111')}`} 
                    alt={tool.name}
                    style={{ width: 36, height: 36 }}
                  />
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#555', marginTop: '6px' }}>{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Details */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>CONTACT DETAILS</h3>
            <Plus 
              className={styles.addBtn} 
              size={24} 
              onClick={() => setIsContactModalOpen(true)}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <div className={styles.contactGrid}>
            <div className={styles.contactItem}>
               <span className={styles.contactLabel}>Resume</span>
               {contactDetails?.resumeLink ? (
                 <a href={contactDetails.resumeLink} target="_blank" rel="noopener noreferrer" className={styles.contactAction} style={{ color: '#FF5C00', textDecoration: 'none' }}>
                   View Resume
                 </a>
               ) : (
                 <span className={styles.contactAction} onClick={() => setIsContactModalOpen(true)} style={{ cursor: 'pointer' }}>Add Resume</span>
               )}
            </div>
            <div className={styles.contactItem}>
               <span className={styles.contactLabel}>Email</span>
               {contactDetails?.contactEmail ? (
                 <a href={`mailto:${contactDetails.contactEmail}`} className={styles.contactAction} style={{ color: '#FF5C00', textDecoration: 'none' }}>
                   {contactDetails.contactEmail}
                 </a>
               ) : (
                 <span className={styles.contactAction} onClick={() => setIsContactModalOpen(true)} style={{ cursor: 'pointer' }}>Add Email</span>
               )}
            </div>
            <div className={styles.contactItem}>
               <span className={styles.contactLabel}>Socials</span>
               {contactDetails?.socials ? (
                 contactDetails.socials.startsWith('http') ? (
                   <a href={contactDetails.socials} target="_blank" rel="noopener noreferrer" className={styles.contactAction} style={{ color: '#FF5C00', textDecoration: 'none' }}>
                     {contactDetails.socials}
                   </a>
                 ) : (
                   <span className={styles.contactAction} style={{ color: '#FF5C00' }}>{contactDetails.socials}</span>
                 )
               ) : (
                 <span className={styles.contactAction} onClick={() => setIsContactModalOpen(true)} style={{ cursor: 'pointer' }}>Add Socials</span>
               )}
            </div>
            <div className={styles.contactItem}>
               <span className={styles.contactLabel}>Phone Number</span>
               {contactDetails?.phoneNumber ? (
                 <a href={`tel:${contactDetails.phoneNumber}`} className={styles.contactAction} style={{ color: '#FF5C00', textDecoration: 'none' }}>
                   {contactDetails.phoneNumber}
                 </a>
               ) : (
                 <span className={styles.contactAction} onClick={() => setIsContactModalOpen(true)} style={{ cursor: 'pointer' }}>Add Phone Number</span>
               )}
            </div>
          </div>
        </section>

        {/* Contact Modal */}
        {isContactModalOpen && (
          <ContactModal
            onClose={() => setIsContactModalOpen(false)}
            onSave={fetchContact}
            initialData={contactDetails}
          />
        )}

        {/* Footer */}
        <footer className={styles.footer}>
            <div className={styles.madeWith}>
            </div>
        </footer>
        {isAddWorkModalOpen && (
          <WorkEditModal 
            onClose={() => setIsAddWorkModalOpen(false)}
            onSave={() => fetchWorks()}
          />
        )}
        {isTestimonialModalOpen && (
          <TestimonialModal 
            onClose={() => setIsTestimonialModalOpen(false)}
            onSave={() => fetchTestimonials()}
            initialData={editingTestimonial}
          />
        )}
        {isExperienceModalOpen && (
          <ExperienceModal 
            key={editingExperience?.id || 'new'}
            onClose={() => setIsExperienceModalOpen(false)}
            onSave={() => fetchExperiences()}
            initialData={editingExperience}
          />
        )}
        {isToolsModalOpen && (
          <ToolsModal 
            onClose={() => setIsToolsModalOpen(false)}
            onSave={() => fetchTools()}
            initialTools={userTools}
          />
        )}
        <ThemeDrawer 
          isOpen={isThemeDrawerOpen} 
          onClose={() => setIsThemeDrawerOpen(false)} 
          currentBackground={background || ""}
          onBackgroundSelect={(bg) => setBackground(bg)}
          currentBlur={blur}
          currentMotion={motion}
          currentCursor={cursor}
          onCursorSelect={(c) => setCursor(c)}
          onUpdateEffects={(b, m) => {
            setBlur(b);
            setMotion(m);
          }}
        />
        <LaunchModal 
          isOpen={isLaunchModalOpen}
          onClose={() => setIsLaunchModalOpen(false)}
          domain={domain || "your-portfolio"}
          updatedAt={lastUpdated}
          onUpdate={async () => {
             // Fake a "sync" to provide immediate visual feedback
             await new Promise(resolve => setTimeout(resolve, 1500));
             fetchStatus(); // Get the actual new updatedAt from DB
          }}
        />
        <SettingsModal 
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
        />
        <BrandingBadge />
        </div>
      </div>
    </div>
  </>
);
};

export default Dashboard;
