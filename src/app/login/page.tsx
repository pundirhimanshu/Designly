"use client";

import AuthLayout from "../../components/AuthLayout";
import Link from "next/link";
import styles from "./login.module.css";
import authStyles from "../../components/AuthLayout.module.css";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (searchParams.get("from") !== "signup") {
      document.cookie = "designly_signup_intent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  }, [searchParams]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout footer={
      <>
        Don't have an account? <Link href="/signup" className={authStyles.footerLink}>Sign up</Link>
      </>
    }>
      <div className={styles.formContent}>
        {searchParams.get("from") === "signup" && !error && (
          <div style={{
            background: 'rgba(76, 175, 80, 0.1)',
            border: '1px solid #4CAF50',
            color: '#2e7d32',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            ✅ Domain registered! Continue with Google to create your account.
          </div>
        )}
        {error === "EmailAlreadyInUse" && (
          <div style={{
            background: 'rgba(255, 107, 107, 0.1)',
            border: '1px solid #ff6b6b',
            color: '#ff6b6b',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            This email is already linked to a domain. Please login directly.
          </div>
        )}
        {error === "SignupRequired" && (
          <div style={{
            background: 'rgba(255, 107, 107, 0.1)',
            border: '1px solid #ff6b6b',
            color: '#ff6b6b',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            You need to <Link href="/signup" style={{ color: '#ff6b6b', fontWeight: 'bold' }}>register your domain</Link> first before you can login.
          </div>
        )}
        <button 
          className={styles.googleBtn} 
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg className={styles.googleIcon} viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue With Google
        </button>
      </div>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      color: '#666'
    }}>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
