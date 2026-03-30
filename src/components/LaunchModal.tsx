"use client";

import React from "react";
import styles from "./LaunchModal.module.css";
import { Copy, Check, RotateCw, X } from "lucide-react";

interface LaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain: string;
  updatedAt: string | null;
  onUpdate: () => Promise<void>;
}

export default function LaunchModal({ isOpen, onClose, domain, updatedAt, onUpdate }: LaunchModalProps) {
  const [copied, setCopied] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);

  if (!isOpen) return null;

  const fullDomain = `${domain}.designly.co.in`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${fullDomain}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTimeAgo = (dateStr: string | null) => {
    if (!dateStr) return "Just now";
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const handleUpdate = async () => {
    setUpdating(true);
    await onUpdate();
    setUpdating(false);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-20px' }}>
             <X size={20} style={{ cursor: 'pointer', color: '#666' }} onClick={onClose} />
        </div>

        <div className={styles.domainRow}>
          <a href={`https://${fullDomain}`} target="_blank" className={styles.domainLink}>
            {fullDomain}
          </a>
          <button className={styles.copyBtn} onClick={handleCopy}>
            {copied ? <Check size={18} color="#22c55e" /> : <Copy size={18} color="#666" />}
          </button>
        </div>

        <p className={styles.updatedAt}>
          Updated: {getTimeAgo(updatedAt)}
        </p>


        <div className={styles.divider} />

        <button 
          className={styles.updateBtn} 
          onClick={handleUpdate}
          disabled={updating}
        >
          {updating ? (
            <RotateCw size={20} className="animate-spin" />
          ) : (
            "Update changes"
          )}
        </button>
      </div>
    </div>
  );
}
