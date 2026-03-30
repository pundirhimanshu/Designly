"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./TestimonialModal.module.css";

interface TestimonialModalProps {
  onClose: () => void;
  onSave: () => void;
  initialData?: {
    id: string;
    name: string;
    role: string | null;
    description: string | null;
    image: string | null;
  };
}

const TestimonialModal: React.FC<TestimonialModalProps> = ({ onClose, onSave, initialData }) => {
  const [name, setName] = useState(initialData?.name || "");
  const [role, setRole] = useState(initialData?.role || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [image, setImage] = useState(initialData?.image || "");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
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
    if (!name) return;
    setLoading(true);
    const endpoint = initialData ? "/api/testimonials/update" : "/api/testimonials/add";
    
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: initialData?.id,
          name, 
          role, 
          description, 
          image 
        }),
      });

      if (res.ok) {
        onSave();
        onClose();
      } else {
        alert("Failed to save testimonial. Please try again.");
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
        <h2 className={styles.title}>{initialData ? "Edit Testimonials" : "Add Testimonials"}</h2>
        
        <div className={styles.avatarSection}>
          <div className={styles.avatarCircle}>
            {image ? (
              <img src={image} alt="Preview" />
            ) : (
              <img src="https://avatar.vercel.sh/designly" alt="Default" />
            )}
          </div>
          <button className={styles.uploadBtn} onClick={() => fileInputRef.current?.click()}>
            Upload Profile
          </button>
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
            placeholder="Enter Testimonials Name"
            className={styles.inputField}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter Testimonials Role"
            className={styles.inputField}
            value={role}
            onChange={(e) => setRole(e.target.value)}
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
          disabled={loading || !name}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default TestimonialModal;
