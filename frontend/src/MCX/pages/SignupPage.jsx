import { useState } from "react";
import API from "../api/axios";

export default function SignupPage({ onLogin, onGoLogin }) {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res  = await API.post("/auth/signup", form );
      const data = await res.data;
      if (data.success) {
        // Auto-login after signup
        const lr   = await API.post("/auth/login", {
          email: form.email, password: form.password
        });
        const ld = await lr.data;
        if (ld.success) onLogin(ld.user);
        else setError("Account created! Please sign in.");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch { setError("Connection error. Please try again."); }
    finally { setLoading(false); }
  };

  const inputStyle = {
    width: "100%", padding: "13px 14px",
    background: "var(--bg-input)",
    border: "1.5px solid var(--border)",
    borderRadius: 11, fontSize: 14,
    color: "var(--text)", outline: "none",
    boxSizing: "border-box", transition: "border-color 0.2s",
    fontFamily: "inherit",
  };

  const labelStyle = {
    display: "block", fontSize: 10, fontWeight: 700,
    color: "var(--text-muted)", marginBottom: 7,
    textTransform: "uppercase", letterSpacing: "0.1em",
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, background: "var(--bg)",
    }}>
      {/* Same geometric bg */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden" }}>
        <svg width="100%" height="100%" style={{ position: "absolute", opacity: 0.045 }}>
          <defs>
            <pattern id="diag2" width="48" height="48" patternUnits="userSpaceOnUse"
              patternTransform="rotate(30)">
              <line x1="0" y1="0" x2="0" y2="48" stroke="var(--accent)" strokeWidth="0.8"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diag2)"/>
        </svg>
        <div style={{
          position: "absolute", top: "-10%", right: "-5%",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
          opacity: 0.08,
        }}/>
        <div style={{
          position: "absolute", bottom: "-15%", left: "-5%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)",
          opacity: 0.07,
        }}/>
      </div>

      <div style={{
        position: "relative", zIndex: 1,
        width: "100%", maxWidth: 500,
        background: "var(--bg-card)",
        border: "1px solid var(--border-2)",
        borderRadius: 24, padding: "44px 40px",
        boxShadow: "var(--shadow)",
        animation: "slideUp 0.55s cubic-bezier(.34,1.56,.64,1)",
      }}>
        {/* Top accent line */}
        <div style={{
          position: "absolute", top: 0, left: "15%", right: "15%", height: 2,
          background: "linear-gradient(90deg,transparent,var(--gold),var(--accent),transparent)",
          borderRadius: "0 0 4px 4px",
        }}/>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16, margin: "0 auto 14px",
            background: "linear-gradient(135deg,var(--gold),var(--accent))",
            display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 28,
            boxShadow: "0 8px 24px rgba(212,160,23,0.4)",
          }}>🚀</div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 26, fontWeight: 700, color: "var(--text)",
          }}>Create Account</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
            Join MCX AI Bot — Trade Smarter
          </div>
        </div>

        <form onSubmit={submit}>
          {/* First + Last name */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            {[
              { k: "firstName", l: "First Name", ph: "Arjun"  },
              { k: "lastName",  l: "Last Name",  ph: "Sharma" },
            ].map(f => (
              <div key={f.k}>
                <label style={labelStyle}>{f.l}</label>
                <input
                  value={form[f.k]} type="text" required
                  onChange={e => set(f.k, e.target.value)}
                  placeholder={f.ph} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "var(--accent)"}
                  onBlur={e  => e.target.style.borderColor = "var(--border)"}
                />
              </div>
            ))}
          </div>

          {[
            { k: "email",    l: "Email",    t: "email",    ph: "arjun@example.com", req: true  },
            { k: "password", l: "Password", t: "password", ph: "••••••••",           req: true  },
            { k: "phone",    l: "Phone",    t: "tel",      ph: "+91 98765 43210",    req: false },
          ].map(f => (
            <div key={f.k} style={{ marginBottom: 14 }}>
              <label style={labelStyle}>{f.l}</label>
              <input
                value={form[f.k]} type={f.t} required={f.req}
                onChange={e => set(f.k, e.target.value)}
                placeholder={f.ph} style={inputStyle}
                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                onBlur={e  => e.target.style.borderColor = "var(--border)"}
              />
            </div>
          ))}

          {error && (
            <div style={{
              background: "var(--red-bg)",
              border: "1px solid rgba(198,40,40,0.25)",
              borderRadius: 10, padding: "11px 16px",
              marginBottom: 16, fontSize: 13,
              color: "var(--red)", textAlign: "center",
            }}>{error}</div>
          )}

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "15px", marginTop: 6,
            background: "linear-gradient(135deg,var(--accent),var(--gold))",
            border: "none", borderRadius: 12,
            fontSize: 15, fontWeight: 700, color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 4px 18px rgba(232,97,10,0.4)",
            transition: "all 0.2s", opacity: loading ? 0.72 : 1,
            letterSpacing: "0.03em", fontFamily: "inherit",
          }}>
            {loading ? "Creating Account…" : "Create Account →"}
          </button>
        </form>

        <div style={{
          textAlign: "center", marginTop: 20,
          fontSize: 13, color: "var(--text-muted)",
        }}>
          Already have an account?{" "}
          <button onClick={onGoLogin} style={{
            background: "none", border: "none",
            color: "var(--accent)", fontWeight: 700,
            cursor: "pointer", fontSize: 13, padding: 0,
          }}>Sign In</button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(36px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input::placeholder { color: var(--text-muted); opacity: 0.5; }
      `}</style>
    </div>
  );
}