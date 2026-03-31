"use client";

import React from "react";
import styles from "./CaseStudyEditor.module.css";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Sparkles, Image as ImageIcon, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CaseStudyEditorProps {
  id: string;
}

export default function CaseStudyEditor({ id }: CaseStudyEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [data, setData] = React.useState<any>({
    title: "",
    description: "",
    image: "",
    client: "",
    role: "",
    industry: "",
    platform: "",
    content: "",
  });

  const editorRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = React.useState<HTMLImageElement | null>(null);
  const [overlayPos, setOverlayPos] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/work/get?id=${id}&t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setData({
            title: json.title || "",
            description: json.description || "",
            image: json.image || "",
            client: json.client || "",
            role: json.role || "",
            industry: json.industry || "",
            platform: json.platform || "",
            content: json.content || "",
          });
          // We no longer set innerHTML here as the ref might not be attached during loading
        }
      } catch (e) {
        console.error("Failed to fetch case study:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Handle initial content sync after editor is fully mounted and loading is done
  React.useEffect(() => {
    if (!loading && data.content && editorRef.current) {
      // Only inject if the editor is currently empty or contains just the placeholder
      if (editorRef.current.innerHTML === "" || editorRef.current.innerHTML === "<br>") {
        editorRef.current.innerHTML = data.content;
      }
    }
  }, [loading, data.content]);

  const handleSave = async () => {
    setSaving(true);
    const content = editorRef.current?.innerHTML || "";
    try {
      const res = await fetch("/api/work/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data, content }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (e) {
      console.error("Failed to save case study:", e);
    } finally {
      setSaving(false);
    }
  };

  const execCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value as string);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleImageInsert = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // Increased to 4MB for high-res support
        alert("Please select an image smaller than 4MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        // Focus the editor before inserting
        if (editorRef.current) {
          editorRef.current.focus();
          execCommand('insertImage', dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
    // Clear the input so the same file can be selected again
    e.target.value = "";
  };

  const handleEditorClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG') {
      const img = target as HTMLImageElement;
      setSelectedImage(img);
      // Position relative to the parent richContent container
      setOverlayPos({
        top: img.offsetTop + 10,
        left: img.offsetLeft + img.offsetWidth - 40
      });
    } else {
      setSelectedImage(null);
    }
  };

  const removeImage = () => {
    if (selectedImage) {
      selectedImage.remove();
      setSelectedImage(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#fff9f0' }}>
        <h1 style={{ color: '#FF5C00', fontFamily: 'Inter, sans-serif' }}>Loading Editor...</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.goBack} onClick={() => router.back()}>
          <ArrowLeft size={16} />
          Go Back
        </button>
      </header>

      <main className={styles.content}>
        <input 
          className={styles.titleInput} 
          value={data.title} 
          onChange={(e) => setData({ ...data, title: e.target.value })}
          placeholder="Case Study Title"
        />
        <textarea 
          className={styles.subtitleInput} 
          value={data.description} 
          onChange={(e) => setData({ ...data, description: e.target.value })}
          placeholder="Short subtitle or description..."
          rows={2}
        />

        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <label className={styles.metaLabel}>App name / Client</label>
            <input 
              className={styles.metaInput} 
              value={data.client} 
              onChange={(e) => setData({ ...data, client: e.target.value })}
              placeholder="e.g. Acme Corp"
            />
          </div>
          <div className={styles.metaItem}>
            <label className={styles.metaLabel}>My Role</label>
            <input 
              className={styles.metaInput} 
              value={data.role} 
              onChange={(e) => setData({ ...data, role: e.target.value })}
              placeholder="e.g. Lead Designer"
            />
          </div>
          <div className={styles.metaItem}>
            <label className={styles.metaLabel}>Industry</label>
            <input 
              className={styles.metaInput} 
              value={data.industry} 
              onChange={(e) => setData({ ...data, industry: e.target.value })}
              placeholder="e.g. Fintech"
            />
          </div>
          <div className={styles.metaItem}>
            <label className={styles.metaLabel}>Platform</label>
            <input 
              className={styles.metaInput} 
              value={data.platform} 
              onChange={(e) => setData({ ...data, platform: e.target.value })}
              placeholder="e.g. Web, iOS"
            />
          </div>
        </div>

        <section className={styles.imageSection}>
          <img src={data.image || "/ST1.png"} alt="Case Study" className={styles.mainImage} />
          <div className={styles.imageOverlay}>
            <div className={styles.changeImageBtn}>Change Image URL</div>
            <input 
              type="text" 
              value={data.image}
              onChange={(e) => setData({ ...data, image: e.target.value })}
              style={{ position: 'absolute', opacity: 0, inset: 0, cursor: 'pointer' }}
              onClick={(e) => {
                const url = prompt("Enter Image URL:", data.image);
                if (url !== null) setData({ ...data, image: url });
                e.preventDefault();
              }}
            />
          </div>
        </section>

        <section className={styles.richContent} style={{ position: 'relative' }}>
           <div 
             ref={editorRef}
             className={styles.editableContent}
             contentEditable
             onClick={handleEditorClick}
             data-placeholder="Start typing your case study story here..."
           />
           <AnimatePresence>
             {selectedImage && (
               <motion.button
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.8 }}
                 className={styles.imageDeleteBtn}
                 style={{ top: overlayPos.top, left: overlayPos.left }}
                 title="Remove Image"
                 onClick={(e) => {
                   e.stopPropagation();
                   removeImage();
                 }}
               >
                 <Trash2 size={16} />
               </motion.button>
             )}
           </AnimatePresence>
        </section>
      </main>

      <div className={styles.toolbar}>
        <div className={styles.toolbarGroup}>
          <button className={styles.toolbarButton} onClick={() => execCommand('bold')}>B</button>
          <button className={styles.toolbarButton} onClick={() => execCommand('italic')} style={{ fontStyle: 'italic' }}>I</button>
          <button className={styles.toolbarButton} onClick={() => execCommand('strikeThrough')} style={{ textDecoration: 'line-through' }}>S</button>
          <button className={styles.toolbarButton} onClick={() => execCommand('underline')} style={{ textDecoration: 'underline' }}>U</button>
        </div>
        <div className={styles.toolbarGroup}>
          <button className={styles.toolbarButton} onClick={() => execCommand('formatBlock', 'H2')}><span className={styles.headingLabel}>H2</span></button>
          <button className={styles.toolbarButton} onClick={() => execCommand('formatBlock', 'H3')}><span className={styles.headingLabel}>H3</span></button>
          <button className={styles.toolbarButton} onClick={() => execCommand('formatBlock', 'H4')}><span className={styles.headingLabel}>H4</span></button>
          <button className={styles.toolbarButton} onClick={() => execCommand('formatBlock', 'H5')}><span className={styles.headingLabel}>H5</span></button>
        </div>
        <div className={styles.toolbarGroup}>
          <button className={styles.toolbarButton} title="Insert Link" onClick={() => {
            const url = prompt("Enter Link URL:");
            if (url) execCommand('createLink', url);
          }}>🔗</button>
          
          <button className={styles.toolbarButton} title="Insert Image" onClick={() => fileInputRef.current?.click()}>
            <ImageIcon size={18} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            hidden 
            accept="image/*" 
            onChange={handleImageInsert} 
          />

          <button className={styles.toolbarButton} title="Unordered List" onClick={() => execCommand('insertUnorderedList')}>•</button>
          <button className={styles.toolbarButton} title="Ordered List" onClick={() => execCommand('insertOrderedList')}>1.</button>
          <button className={styles.toolbarButton} title="Quote" onClick={() => execCommand('formatBlock', 'blockquote')}>"</button>
        </div>
        <div className={styles.toolbarGroup}>
           <button className={styles.toolbarButton} onClick={() => execCommand('undo')}>↶</button>
           <button className={styles.toolbarButton} onClick={() => execCommand('redo')}>↷</button>
        </div>
      </div>

      <button 
        className={`${styles.saveBtn} ${saving ? styles.saving : ""}`} 
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
