import { useState } from "react";
import API from "../api/axios";

const GeoBg = () => (
  <div style={{ position: "fixed", inset: 0, overflow: "hidden", zIndex: 0 }}>
    <svg width="100%" height="100%" style={{ position: "absolute", opacity: 0.055 }}>
      <defs>
        <pattern id="diag" width="48" height="48" patternUnits="userSpaceOnUse"
          patternTransform="rotate(30)">
          <line x1="0" y1="0" x2="0" y2="48" stroke="var(--accent)" strokeWidth="0.8"/>
        </pattern>
        <pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="16" cy="16" r="1" fill="var(--gold)"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#diag)"/>
      <rect width="100%" height="100%" fill="url(#dots)"/>
    </svg>

    {/* Glowing orbs */}
    {[
      { top: "-15%", right: "-5%",  size: 600, c: "var(--accent)", o: 0.10 },
      { bottom: "-20%", left: "-8%", size: 500, c: "var(--gold)",   o: 0.08 },
      { top: "40%", left: "30%",    size: 300, c: "var(--accent)",  o: 0.04 },
    ].map((orb, i) => (
      <div key={i} style={{
        position: "absolute",
        width: orb.size, height: orb.size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${orb.c} 0%, transparent 70%)`,
        opacity: orb.o,
        top: orb.top, bottom: orb.bottom,
        left: orb.left, right: orb.right,
        pointerEvents: "none",
      }}/>
    ))}

    {/* Rangoli-inspired rings */}
    {[180, 280, 380, 480].map((r, i) => (
      <div key={i} style={{
        position: "absolute",
        width: r * 2, height: r * 2,
        borderRadius: "50%",
        border: `1px solid rgba(232,97,10,${0.07 - i * 0.014})`,
        top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        animation: `breathe ${3.5 + i * 0.6}s ease-in-out infinite alternate`,
      }}/>
    ))}
    <style>{`
      @keyframes breathe {
        from { transform: translate(-50%,-50%) scale(1); }
        to   { transform: translate(-50%,-50%) scale(1.04); }
      }
    `}</style>
  </div>
);

export default function LoginPage({ onLogin, onGoSignup }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res  = await API.post("/auth/login", {
        email, password
      });
      const data = await res.data;
      if (data.success) onLogin(data.user);
      else setError(data.message || "Login failed");
    } catch(err) { console.error(err); setError("Connection error. Please try again.");
     }
    finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, position: "relative",
      background: "var(--bg)",
    }}>
      <GeoBg/>

      <div style={{
        position: "relative", zIndex: 1,
        width: "100%", maxWidth: 440,
        background: "var(--bg-card)",
        border: "1px solid var(--border-2)",
        borderRadius: 24,
        padding: "48px 40px",
        boxShadow: "var(--shadow), 0 0 0 1px rgba(232,97,10,0.06)",
        animation: "slideUp 0.55s cubic-bezier(.34,1.56,.64,1)",
      }}>
        {/* Decorative top line */}
        <div style={{
          position: "absolute", top: 0, left: "15%", right: "15%", height: 2,
          background: "linear-gradient(90deg, transparent, var(--accent), var(--gold), transparent)",
          borderRadius: "0 0 4px 4px",
        }}/>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 68, height: 68, borderRadius: 18, margin: "0 auto 16px",
            background: "linear-gradient(135deg,var(--accent),var(--gold))",
            display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 30,
            boxShadow: "0 8px 28px rgba(232,97,10,0.45)",
          }}>📈</div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 30, fontWeight: 700,
            color: "var(--text)", letterSpacing: "-0.01em",
          }}>MCX AI Bot</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4,
            letterSpacing: "0.06em" }}>
            Commodity Intelligence Platform
          </div>
        </div>

        <form onSubmit={submit}>
          {/* Email */}
          <div style={{ marginBottom: 18 }}>
            <label style={{
              display: "block", fontSize: 11, fontWeight: 700,
              color: "var(--text-muted)", marginBottom: 8,
              textTransform: "uppercase", letterSpacing: "0.1em",
            }}>Email Address</label>
            <input
              type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: "100%", padding: "13px 16px",
                background: "var(--bg-input)",
                border: "1.5px solid var(--border)",
                borderRadius: 12, fontSize: 14,
                color: "var(--text)", outline: "none",
                boxSizing: "border-box", transition: "border-color 0.2s",
                fontFamily: "inherit",
              }}
              onFocus={e => e.target.style.borderColor = "var(--accent)"}
              onBlur={e  => e.target.style.borderColor = "var(--border)"}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 28, position: "relative" }}>
            <label style={{
              display: "block", fontSize: 11, fontWeight: 700,
              color: "var(--text-muted)", marginBottom: 8,
              textTransform: "uppercase", letterSpacing: "0.1em",
            }}>Password</label>
            <input
              type={showPass ? "text" : "password"} required value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%", padding: "13px 46px 13px 16px",
                background: "var(--bg-input)",
                border: "1.5px solid var(--border)",
                borderRadius: 12, fontSize: 14,
                color: "var(--text)", outline: "none",
                boxSizing: "border-box", transition: "border-color 0.2s",
                fontFamily: "inherit",
              }}
              onFocus={e => e.target.style.borderColor = "var(--accent)"}
              onBlur={e  => e.target.style.borderColor = "var(--border)"}
            />
            <button type="button" onClick={() => setShowPass(p => !p)}
              style={{
                position: "absolute", right: 14, top: 42,
                background: "none", border: "none",
                cursor: "pointer", fontSize: 16,
                color: "var(--text-muted)", padding: 0,
              }}>
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>

          {error && (
            <div style={{
              background: "var(--red-bg)",
              border: "1px solid rgba(198,40,40,0.25)",
              borderRadius: 10, padding: "11px 16px",
              marginBottom: 18, fontSize: 13,
              color: "var(--red)", textAlign: "center",
            }}>{error}</div>
          )}

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "15px",
            background: "linear-gradient(135deg,var(--accent),var(--gold))",
            border: "none", borderRadius: 12,
            fontSize: 15, fontWeight: 700,
            color: "#fff", cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 4px 18px rgba(232,97,10,0.45)",
            transition: "all 0.2s", opacity: loading ? 0.72 : 1,
            letterSpacing: "0.03em", fontFamily: "inherit",
          }}>
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <div style={{
          textAlign: "center", marginTop: 22,
          fontSize: 13, color: "var(--text-muted)",
        }}>
          Don't have an account?{" "}
          <button onClick={onGoSignup} style={{
            background: "none", border: "none",
            color: "var(--accent)", fontWeight: 700,
            cursor: "pointer", fontSize: 13, padding: 0,
          }}>Create Account</button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(36px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input::placeholder { color: var(--text-muted); opacity: 0.55; }
      `}</style>
    </div>
  );
}