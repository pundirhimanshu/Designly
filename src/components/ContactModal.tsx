"use client";

import React, { useState, useEffect } from "react";
import styles from "./ToolsModal.module.css";
import { X, Loader2 } from "lucide-react";

interface ContactData {
  resumeLink: string;
  contactEmail: string;
  socials: string;
  phoneNumber: string;
}

interface ContactModalProps {
  onClose: () => void;
  onSave: () => void;
  initialData?: ContactData;
}

const ContactModal: React.FC<ContactModalProps> = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<ContactData>({
    resumeLink: "",
    contactEmail: "",
    socials: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onSave();
        onClose();
      } else {
        alert("Failed to save contact details. Please try again.");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isEdit = !!(initialData?.resumeLink || initialData?.contactEmail || initialData?.socials || initialData?.phoneNumber);

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} style={{ maxWidth: '400px' }}>
        <div className={styles.modalHeader}>
          <h2 className={styles.title} style={{ fontSize: '24px', marginBottom: '20px' }}>
            {isEdit ? "Edit Contacts Details" : "Add Contacts Details"}
          </h2>
        </div>

        <div className={styles.formGroup} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <div className={styles.inputWrapper}>
             <input
              type="text"
              name="resumeLink"
              placeholder="Add Resume Link"
              className={styles.searchInput}
              value={formData.resumeLink}
              onChange={handleChange}
              style={{ width: '100%', borderRadius: '100px', padding: '12px 20px', border: '1px solid #ddd' }}
            />
          </div>
          <div className={styles.inputWrapper}>
            <input
              type="email"
              name="contactEmail"
              placeholder="Add Email"
              className={styles.searchInput}
              value={formData.contactEmail}
              onChange={handleChange}
              style={{ width: '100%', borderRadius: '100px', padding: '12px 20px', border: '1px solid #ddd' }}
            />
          </div>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              name="socials"
              placeholder="Add Socials Instagram,medium,Dribbble"
              className={styles.searchInput}
              value={formData.socials}
              onChange={handleChange}
              style={{ width: '100%', borderRadius: '100px', padding: '12px 20px', border: '1px solid #ddd' }}
            />
          </div>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              name="phoneNumber"
              placeholder="Add Phone Number"
              className={styles.searchInput}
              value={formData.phoneNumber}
              onChange={handleChange}
              style={{ width: '100%', borderRadius: '100px', padding: '12px 20px', border: '1px solid #ddd' }}
            />
          </div>
        </div>

        <button
          className={styles.primaryBtn}
          onClick={handleSave}
          disabled={loading}
          style={{ 
            width: '100%', 
            borderRadius: '100px', 
            padding: '14px', 
            background: '#FF5C00', 
            color: 'white', 
            fontWeight: 'bold',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {loading && <Loader2 size={18} className={styles.spinner} />}
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default ContactModal;
