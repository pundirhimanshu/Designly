"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import styles from "./ProfileEditModal.module.css";

interface ProfileEditModalProps {
  initialData: {
    name: string;
    bio: string;
    skills: string[];
    image: string;
  };
  onClose: () => void;
  onSave: (data: any) => void;
}

const ALL_SKILLS = [
  "Figma",
  "Information Architecture",
  "User flows",
  "Communication",
  "Backend Development",
  "Devops Development",
  "Other"
];

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ 
  initialData, 
  onClose, 
  onSave 
}) => {
  const { update } = useSession();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialData);
  const [otherSkillsInput, setOtherSkillsInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Process custom skills if "Other" is selected
      let finalSkills = formData.skills.filter(s => s !== "Other");
      if (formData.skills.includes("Other") && otherSkillsInput.trim()) {
        const customSkills = otherSkillsInput
          .split(",")
          .map(s => s.trim())
          .filter(s => s !== "");
        finalSkills = [...finalSkills, ...customSkills];
      }

      const res = await fetch("/api/user/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, skills: finalSkills }),
      });

      if (res.ok) {
        // Update session in-place
        await update();
        onSave({ ...formData, skills: finalSkills });
        onClose();
      } else {
        alert("Failed to update profile. Please try again.");
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
        {/* Progress Bar */}
        <div className={styles.progressBar}>
          <div className={`${styles.progressItem} ${step >= 1 ? styles.progressActive : ""}`} />
          <div className={`${styles.progressItem} ${step >= 2 ? styles.progressActive : ""}`} />
        </div>

        {step === 1 ? (
          <>
            <h2 className={styles.title}>Edit Profile section</h2>
            
            <div className={styles.avatarUploadSection}>
              <div className={styles.avatarPreview}>
                <img src={formData.image || "/A1.png"} alt="Preview" />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className={styles.hiddenInput} 
                accept="image/*"
                onChange={handleImageChange}
              />
              <button 
                className={styles.uploadBtn}
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Profile
              </button>
            </div>

            <div className={styles.formGroup}>
              <input
                type="text"
                placeholder="Enter Your Name"
                className={styles.inputField}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <textarea
                placeholder="Mention your description"
                className={styles.textareaField}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>
            <button 
              className={styles.primaryBtn} 
              onClick={() => setStep(2)}
              disabled={!formData.name}
            >
              Next
            </button>
          </>
        ) : (
          <>
            <h2 className={styles.title}>Edit Skill section</h2>
            <div className={styles.skillsGrid}>
              {ALL_SKILLS.map(skill => (
                <div 
                  key={skill}
                  className={`${styles.skillPill} ${formData.skills.includes(skill) ? styles.skillPillActive : ""}`}
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                </div>
              ))}
            </div>

            {formData.skills.includes("Other") && (
              <div className={styles.formGroup} style={{ marginTop: '20px' }}>
                <textarea
                  placeholder="Add multiple skills separated by comma (e.g. React, Node.js, Design Systems)"
                  className={styles.textareaField}
                  value={otherSkillsInput}
                  onChange={(e) => setOtherSkillsInput(e.target.value)}
                />
              </div>
            )}

            <div className={styles.buttonRow}>
              <button className={styles.secondaryBtn} onClick={() => setStep(1)}>
                Back
              </button>
              <button 
                className={styles.primaryBtn} 
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileEditModal;
