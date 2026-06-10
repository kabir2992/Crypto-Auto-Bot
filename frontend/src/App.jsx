import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// ─── Binance Pages ────────────────────────────────────────────────────────────
import Dashboard       from "./Binance/pages/Dashboard";
import MiniDashboard   from "./Binance/pages/MiniDashboard";
import AIAnalytics     from "./Binance/pages/AIAnalytics";
import Chart           from "./Binance/pages/Chart";
import MoneyManagement from "./Binance/pages/MoneyManagement";
import TradeHistory    from "./Binance/pages/TradeHistory";

// ─── MCX Core ────────────────────────────────────────────────────────────────
import { ThemeProvider }  from "./MCX/context/ThemeContext";
import { useLivePrice }   from "./MCX/hooks/useLivePrice";
import { useBotState }    from "./MCX/hooks/useBotState";
import LoadingScreen      from "./MCX/components/LoadingScreen";
import Sidebar            from "./MCX/components/Sidebar";
import Topbar             from "./MCX/components/Topbar";
import API                from "./MCX/api/axios";

// ─── MCX Pages ────────────────────────────────────────────────────────────────
import MCXDashboard   from "./MCX/pages/Dashboard";
import LoginPage      from "./MCX/pages/LoginPage";
import SignupPage     from "./MCX/pages/SignupPage";
import MCXCharts      from "./MCX/pages/Charts";
import Analytics      from "./MCX/pages/Analytics";
import MCXHistory     from "./MCX/pages/TradeHistory";
import Wallet         from "./MCX/pages/Wallet";
import Settings       from "./MCX/pages/Settings";

// ─── PAGE META ────────────────────────────────────────────────────────────────
const PAGE_META = {
  dashboard: { icon: "📊", label: "Dashboard"     },
  charts:    { icon: "📈", label: "Charts"        },
  analytics: { icon: "🤖", label: "AI Analytics"  },
  history:   { icon: "📋", label: "Trade History" },
  wallet:    { icon: "💰", label: "Wallet"        },
  settings:  { icon: "⚙️",  label: "Settings"     },
};

// ============================================================
// MCX APP SHELL
// Wraps all MCX pages with sidebar + topbar layout
// Auth is handled inside here — no separate /mcx-login route
// ============================================================
function MCXApp() {
  const navigate = useNavigate();

  const [user,      setUser]      = useState(null);
  const [authPage,  setAuthPage]  = useState("login");
  const [page,      setPage]      = useState("dashboard");
  const [symbols,   setSymbols]   = useState([]);
  const [selSymbol, setSelSymbol] = useState(null);
  const [appReady,  setAppReady]  = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen,setMobileOpen]= useState(false);
  const [isMobile,  setIsMobile]  = useState(window.innerWidth < 768);

  // Responsive
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  // Check existing session
  useEffect(() => {
    API.get("/auth/profile")
      .then(r => r.data)
      .then(d => { if (d.success) setUser(d.user); })
      .catch(() => {})
      .finally(() => setAppReady(true));
  }, []);

  // Fetch symbol list
  useEffect(() => {
    if (!user) return;
    const load = () => {
        API.get("/mcxmarket/symbols")
            .then(r => r.data)
            .then(d => {
                console.log("Symbols:", d);
                if (d.symbols?.length) {
                    setSymbols(d.symbols);
                    setSelSymbol(prev => prev || d.symbols[0]);
                } else {
                    // Retry after 2s if empty (server still loading)
                    setTimeout(load, 2000);
                }
            })
            .catch(() => setTimeout(load, 2000));
    };
    load();
}, [user]);

  const { prices, flashColors } = useLivePrice(!!user);
  const { botStates, getBotState, nextAnalysisTime } = useBotState(!!user);
  const [botState, setBotState] = useState(null);
  useEffect(() => {
      setBotState(getBotState(selSymbol));
  }, [selSymbol, botStates]);

  const handleLogin = (u) => {
    setUser(u);
    setAuthPage("login");
  };

  const handleLogout = async () => {
    await API.post("/auth/logout");
    setUser(null);
    setPage("dashboard");
  };

  // ── Loading ───────────────────────────────────────────────
  if (!appReady) return <LoadingScreen message="Initialising MCX AI Bot..."/>;

  // ── Auth screens ──────────────────────────────────────────
  if (!user) {
    return authPage === "login"
      ? <LoginPage
          onLogin={handleLogin}
          onGoSignup={() => setAuthPage("signup")}
        />
      : <SignupPage
          onLogin={handleLogin}
          onGoLogin={() => setAuthPage("login")}
        />;
  }

  // ── Layout ────────────────────────────────────────────────
  const sidebarW   = isMobile ? 0 : (collapsed ? 64 : 240);
  const meta       = PAGE_META[page] || PAGE_META.dashboard;
  const livePrice  = selSymbol ? prices[selSymbol]      : null;
  const flashColor = selSymbol ? flashColors[selSymbol] : null;

  const handleNav = (id) => {
    setPage(id);
    if (isMobile) setMobileOpen(false);
  };

  console.log("selSymbol:", selSymbol);
console.log("botStates:", botStates);
console.log("botState:", botState);
console.log("nextAnalysisTime:", nextAnalysisTime);

  const renderPage = () => {
    switch (page) {
      case "dashboard": return (
        <MCXDashboard
          symbol={selSymbol}
          prices={prices}
          flashColors={flashColors}
          botState={botState}
          nextAnalysisTime={nextAnalysisTime}
        />
      );
      case "charts":    return <MCXCharts symbol={selSymbol}/>;
      case "analytics": return <Analytics/>;
      case "history":   return <MCXHistory/>;
      case "wallet":    return <Wallet/>;
      case "settings":  return <Settings symbols={symbols}/>;
      default:          return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>

      {/* Mobile backdrop */}
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.65)", zIndex: 99,
          }}
        />
      )}

      {/* Sidebar */}
      {(!isMobile || mobileOpen) && (
        <Sidebar
          active={page}
          onNav={handleNav}
          onLogout={handleLogout}
          collapsed={isMobile ? false : collapsed}
          onToggle={isMobile
            ? () => setMobileOpen(false)
            : () => setCollapsed(c => !c)}
        />
      )}

      {/* Mobile hamburger */}
      {isMobile && !mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          style={{
            position: "fixed", top: 16, left: 16, zIndex: 101,
            width: 40, height: 40, borderRadius: 10,
            background: "var(--bg-sidebar)",
            border: "1px solid rgba(240,217,181,0.15)",
            color: "var(--text-sidebar)", fontSize: 18,
            cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
          }}
        >☰</button>
      )}

      {/* Topbar */}
      <Topbar
        user={user}
        selectedSymbol={selSymbol}
        onSymbolChange={setSelSymbol}
        livePrice={livePrice}
        flashColor={flashColor}
        symbols={symbols}
        sidebarWidth={sidebarW}
      />

      {/* Main content */}
      <main style={{
        marginLeft: isMobile ? 0 : sidebarW,
        paddingTop: 64, minHeight: "100vh",
        transition: "margin-left 0.3s cubic-bezier(.4,0,.2,1)",
      }}>
        <div style={{ padding: isMobile ? "16px" : "24px 28px" }}>
          {/* Page heading */}
          <div style={{ marginBottom: 24, paddingTop: 8 }}>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: isMobile ? 22 : 28, fontWeight: 700,
              color: "var(--text)", margin: 0,
            }}>
              {meta.icon} {meta.label}
            </h1>
            {selSymbol && (
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                {selSymbol}
              </div>
            )}
          </div>

          {renderPage()}
        </div>
      </main>
    </div>
  );
}

// ============================================================
// BINANCE + MCX ROUTES
// ============================================================
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* ── Binance ───────────────────────────────────── */}
        <Route path="/"                element={<Dashboard/>}/>
        <Route path="/charts"          element={<Chart/>}/>
        <Route path="/ai-analytics"    element={<AIAnalytics/>}/>
        <Route path="/money-management"element={<MoneyManagement/>}/>
        <Route path="/trade-history"   element={<TradeHistory/>}/>
        <Route path="/mini-dashboard"  element={<MiniDashboard/>}/>

        {/* ── MCX — all sub-pages handled inside MCXApp ─ */}
        <Route
          path="/mcx/*"
          element={
            <ThemeProvider>
              <MCXApp/>
            </ThemeProvider>
          }
        />

        {/* Old MCX routes — redirect to /mcx so nothing breaks */}
        <Route path="/mcx-login"        element={<Navigate to="/mcx" replace/>}/>
        <Route path="/mcx-signup"       element={<Navigate to="/mcx" replace/>}/>
        <Route path="/mcx-tardehistroy" element={<Navigate to="/mcx" replace/>}/>
        <Route path="/mcx-settings"     element={<Navigate to="/mcx" replace/>}/>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace/>}/>

      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes/>
    </BrowserRouter>
  );
}