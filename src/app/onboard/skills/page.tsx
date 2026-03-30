"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../onboard.module.css";

const SKILLS = [
  "Design Thinking",
  "Figma",
  "Communication",
  "User flows",
  "Information Architecture",
  "Frontend Development",
  "Backend Development",
  "Other"
];

export default function SkillsPage() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill) 
        : [...prev, skill]
    );
  };

  const handleCreate = async () => {
    if (selectedSkills.length < 3) return;
    
    setLoading(true);
    const role = localStorage.getItem("onboard_role");
    
    try {
      const response = await fetch("/api/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, skills: selectedSkills }),
      });

      if (response.ok) {
        // Clear temp storage
        localStorage.removeItem("onboard_role");
        router.push("/");
      }
    } catch (error) {
      console.error("Onboarding failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.progressContainer}>
        <div className={`${styles.progressBar} ${styles.progressBarActive}`}></div>
        <div className={`${styles.progressBar} ${styles.progressBarActive}`}></div>
      </div>

      <h1 className={styles.title}>Select your best skills</h1>
      <p className={styles.subtitle}>Select atleast 3 skiils</p>

      <div className={styles.chipGrid}>
        {SKILLS.map((skill) => (
          <button
            key={skill}
            className={`${styles.chip} ${selectedSkills.includes(skill) ? styles.chipActive : ""}`}
            onClick={() => toggleSkill(skill)}
          >
            {skill}
          </button>
        ))}
      </div>

      <button 
        className={styles.nextBtn} 
        onClick={handleCreate}
        disabled={selectedSkills.length < 3 || loading}
      >
        {loading ? "Creating..." : "Create Now"}
      </button>
    </>
  );
}
