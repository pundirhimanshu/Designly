"use client";

import React from "react";
import styles from "./SettingsModal.module.css";
import { X, Globe } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Settings</h2>
          
          <button 
            className={`${styles.sidebarItem} ${styles.sidebarItemActive}`}
          >
            <Globe size={18} />
            Domain
          </button>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Custom domain</h3>
              <span className={styles.badge}>Coming Soon</span>
            </div>
            <p className={styles.sectionSubtitle}>
              Use your own domain — make your portfolio truly yours
            </p>

            <div className={styles.proCard}>
              <h4 className={styles.proTitle}>Coming soon on Designly Pro</h4>
              <p className={styles.proDesc}>
                Want to connect your own domain? This feature is coming soon to Designly Pro to make your portfolio look like a real website.
              </p>
              
              <button className={styles.upgradeBtn}>
                Upgrade to Pro
              </button>

              <div className={styles.inputGroup}>
                <input 
                  type="text" 
                  placeholder="yourdomain.com" 
                  className={styles.domainInput} 
                  disabled
                />
                <button className={styles.updateBtn}>
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
