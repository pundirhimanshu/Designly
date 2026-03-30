"use client";

import AuthLayout from "../../components/AuthLayout";
import Link from "next/link";
import styles from "./signup.module.css";
import authStyles from "../../components/AuthLayout.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function SignupPage() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return setError("Please enter a domain name");
    
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Save to cookie and localStorage
        Cookies.set("designly_pending_domain", domain, { expires: 1 }); // 1 day
        // Set short-lived intent cookie to distinguish from normal login
        Cookies.set("designly_signup_intent", "true", { expires: 1/288 }); // 5 minutes (1/288 of a day)
        localStorage.setItem("pending_domain", domain);
        router.push("/login?from=signup");
      } else {
        setError(data.error || "Signup failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout footer={
      <>
        Already have an account? <Link href="/login" className={authStyles.footerLink}>Login</Link>
      </>
    }>
      <form className={styles.formContent} onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <input 
            type="text" 
            className={styles.domainInput} 
            placeholder="Simply type your name" 
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            disabled={loading}
          />
          <span className={styles.suffix}>.designly.me</span>
        </div>
        
        {error && <p className={styles.errorText}>{error}</p>}
        
        <button 
          type="submit" 
          className={styles.nextBtn}
          disabled={loading}
        >
          {loading ? "Registering..." : "Next"}
        </button>
      </form>
    </AuthLayout>
  );
}
