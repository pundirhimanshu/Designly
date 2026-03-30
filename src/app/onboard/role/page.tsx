"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../onboard.module.css";

const ROLES = [
  "Product Designer",
  "UI Designer",
  "UX Designer",
  "UX/UI Designer",
  "Product Manager",
  "Engineer",
  "Other"
];

export default function RolePage() {
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const router = useRouter();

  const handleNext = () => {
    // Save to localStorage or context temporarily
    localStorage.setItem("onboard_role", selectedRole);
    router.push("/onboard/skills");
  };

  return (
    <>
      <div className={styles.progressContainer}>
        <div className={`${styles.progressBar} ${styles.progressBarActive}`}></div>
        <div className={styles.progressBar}></div>
      </div>

      <h1 className={styles.title}>Which role fits you best?</h1>
      <p className={styles.subtitle}>Select at least 1 role</p>

      <div className={styles.chipGrid}>
        {ROLES.map((role) => (
          <button
            key={role}
            className={`${styles.chip} ${selectedRole === role ? styles.chipActive : ""}`}
            onClick={() => setSelectedRole(role)}
          >
            {role}
          </button>
        ))}
      </div>

      <button className={styles.nextBtn} onClick={handleNext}>
        Next
      </button>
    </>
  );
}
