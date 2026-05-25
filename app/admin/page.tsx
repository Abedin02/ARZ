"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/api/auth";
import { supabase } from "@/supabaseClient";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (mounted && session) {
        router.replace("/admin/dashboard");
      }
    }

    checkSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace("/admin/dashboard");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  async function handleLogin() {
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      router.push("/admin/dashboard");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
    setLoading(false);
  }

  async function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleLogin();
  }

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420, display: "grid", gap: 24 }}>

        {/* Logo mark */}
        <div style={{ textAlign: "center", display: "grid", gap: 6 }}>
          <div
            style={{
              fontSize: "2.2rem",
              fontWeight: 800,
              letterSpacing: "0.12em",
            }}
          >
            ARZ
          </div>
          <div className="eyebrow" style={{ letterSpacing: "0.2em" }}>
            Staff portal
          </div>
        </div>

        {/* Card */}
        <div
          className="glass-card"
          style={{
            padding: "40px 36px",
            borderRadius: "28px",
            display: "grid",
            gap: 20,
          }}
        >
          <div style={{ display: "grid", gap: 6, marginBottom: 8 }}>
            <h1
              style={{
                fontSize: "1.6rem",
                fontWeight: 700,
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Welcome back
            </h1>
            <p className="muted" style={{ margin: 0, fontSize: "0.9rem" }}>
              Sign in to manage your inventory.
            </p>
          </div>

          {/* Email */}
          <div style={{ display: "grid", gap: 6 }}>
            <label
              className="muted"
              style={{ fontSize: "0.78rem", letterSpacing: "0.06em", textTransform: "uppercase" }}
            >
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                padding: "12px 16px",
                borderRadius: "14px",
                border: "1px solid rgba(21,32,43,0.12)",
                background: "rgba(255,255,255,0.7)",
                fontSize: "0.95rem",
                width: "100%",
                outline: "none",
              }}
            />
          </div>

          {/* Password */}
          <div style={{ display: "grid", gap: 6 }}>
            <label
              className="muted"
              style={{ fontSize: "0.78rem", letterSpacing: "0.06em", textTransform: "uppercase" }}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                padding: "12px 16px",
                borderRadius: "14px",
                border: "1px solid rgba(21,32,43,0.12)",
                background: "rgba(255,255,255,0.7)",
                fontSize: "0.95rem",
                width: "100%",
                outline: "none",
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <p
              style={{
                margin: 0,
                fontSize: "0.85rem",
                color: "rgb(220,38,38)",
                padding: "10px 14px",
                background: "rgba(220,38,38,0.06)",
                borderRadius: "10px",
                border: "1px solid rgba(220,38,38,0.15)",
              }}
            >
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            className="pill pill-primary"
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "0.95rem",
              letterSpacing: "0.04em",
              marginTop: 4,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>

        {/* Footer note */}
        <p
          className="muted"
          style={{ textAlign: "center", fontSize: "0.78rem", margin: 0 }}
        >
          This area is restricted to authorized staff only.
        </p>

      </div>
    </div>
  );
}
