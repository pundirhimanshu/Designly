"use client";

import React, { useState } from "react";
import styles from "./ExperienceModal.module.css";

interface ExperienceModalProps {
  onClose: () => void;
  onSave: () => void;
  initialData?: {
    id: string;
    company: string;
    designation: string | null;
    fromDate: string | null;
    toDate: string | null;
    currentlyWorking: boolean;
  };
}

const ExperienceModal: React.FC<ExperienceModalProps> = ({ onClose, onSave, initialData }) => {
  const [company, setCompany] = useState(initialData?.company || "");
  const [designation, setDesignation] = useState(initialData?.designation || "");
  const [fromDate, setFromDate] = useState(initialData?.fromDate || "");
  const [toDate, setToDate] = useState(initialData?.toDate || "");
  const [currentlyWorking, setCurrentlyWorking] = useState(initialData?.currentlyWorking || false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!company) return;
    setLoading(true);
    const endpoint = initialData ? "/api/experience/update" : "/api/experience/add";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: initialData?.id,
          company,
          designation,
          fromDate,
          toDate: currentlyWorking ? null : toDate,
          currentlyWorking,
        }),
      });

      if (res.ok) {
        onSave();
        onClose();
      } else {
        alert("Failed to save experience. Please try again.");
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setLoading(false);
    }
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());

  const getMonthAndYear = (dateStr: string) => {
    if (!dateStr || !dateStr.includes('-')) return { month: "", year: "" };
    const [y, m] = dateStr.split('-');
    return { month: m, year: y };
  };

  const updateDate = (type: 'from' | 'to', part: 'month' | 'year', val: string) => {
    const current = type === 'from' ? fromDate : toDate;
    const { month, year } = getMonthAndYear(current);
    const newMonth = part === 'month' ? val : (month || "01");
    const newYear = part === 'year' ? val : (year || currentYear.toString());
    const newDate = `${newYear}-${newMonth}`;
    if (type === 'from') setFromDate(newDate);
    else setToDate(newDate);
  };

  const fromParts = getMonthAndYear(fromDate);
  const toParts = getMonthAndYear(toDate);

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <h2 className={styles.title}>{initialData ? "Edit Experience" : "Add Experience"}</h2>

        <div className={styles.formGroup}>
          <input
            type="text"
            placeholder="Enter Company Name"
            className={styles.inputField}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter Designation"
            className={styles.inputField}
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          />
          
          <div className={styles.dateRow}>
            {/* From Date */}
            <div className={styles.dateGroup}>
              <label className={styles.dateLabel}>From Date</label>
              <div className={styles.dateSelects}>
                <select 
                  className={styles.dateSelect}
                  value={fromParts.month}
                  onChange={(e) => updateDate('from', 'month', e.target.value)}
                >
                  <option value="" disabled>Month</option>
                  {months.map((m, i) => (
                    <option key={m} value={(i + 1).toString().padStart(2, '0')}>{m}</option>
                  ))}
                </select>
                <select 
                  className={styles.dateSelect}
                  value={fromParts.year}
                  onChange={(e) => updateDate('from', 'year', e.target.value)}
                >
                  <option value="" disabled>Year</option>
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* To Date */}
            <div className={styles.dateGroup}>
              <label className={styles.dateLabel}>To Date</label>
              <div className={styles.dateSelects}>
                <select 
                  className={styles.dateSelect}
                  value={toParts.month}
                  onChange={(e) => updateDate('to', 'month', e.target.value)}
                  disabled={currentlyWorking}
                >
                  <option value="" disabled>Month</option>
                  {months.map((m, i) => (
                    <option key={m} value={(i + 1).toString().padStart(2, '0')}>{m}</option>
                  ))}
                </select>
                <select 
                  className={styles.dateSelect}
                  value={toParts.year}
                  onChange={(e) => updateDate('to', 'year', e.target.value)}
                  disabled={currentlyWorking}
                >
                  <option value="" disabled>Year</option>
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.checkboxRow}>
            <input
              type="checkbox"
              id="currentlyWorking"
              className={styles.checkbox}
              checked={currentlyWorking}
              onChange={(e) => setCurrentlyWorking(e.target.checked)}
            />
            <label htmlFor="currentlyWorking" className={styles.checkboxLabel}>
              Currently Working here
            </label>
          </div>
        </div>

        <button
          className={styles.primaryBtn}
          onClick={handleSave}
          disabled={loading || !company}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default ExperienceModal;
