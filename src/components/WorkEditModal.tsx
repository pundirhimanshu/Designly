"use client";

import React, { useState, useRef } from "react";
import styles from "./WorkEditModal.module.css";

interface WorkEditModalProps {
  onClose: () => void;
  onSave: (work: any) => void;
}

const WorkEditModal: React.FC<WorkEditModalProps> = ({ onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit for base64 safety
        alert("Image size should be less than 1MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!title) return;
    setLoading(true);
    try {
      const res = await fetch("/api/work/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, image }),
      });

      if (res.ok) {
        const data = await res.json();
        onSave(data.work);
        onClose();
      } else {
        alert("Failed to save work. Please try again.");
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Add your work</h2>
        
        <div 
          className={styles.uploadSection} 
          onClick={() => fileInputRef.current?.click()}
        >
          {image ? (
            <img src={image} alt="Preview" className={styles.previewImage} />
          ) : (
            <div className={styles.uploadIconArea}>
              <span className={styles.uploadTitle}>Upload Cover Image</span>
              <span className={styles.uploadSubtitle}>Maximum Size 400*300 px</span>
            </div>
          )}
          {!image && (
            <button className={styles.uploadBtn}>Upload Profile</button>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            className={styles.hiddenInput} 
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div className={styles.formGroup}>
          <input
            type="text"
            placeholder="Enter Your Work name"
            className={styles.inputField}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Mention your description"
            className={styles.textareaField}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button 
          className={styles.primaryBtn} 
          onClick={handleSave}
          disabled={loading || !title}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default WorkEditModal;
