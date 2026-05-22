import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import CoinLoader from "../components/loaders/CoinLoader";

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setPageLoading(true);
    const timer = setTimeout(() => setPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    // ✅ h-screen + overflow-hidden on root — scroll happens INSIDE, not on body
    <div className="h-screen flex overflow-hidden bg-slate-100 dark:bg-[#020617] dark:text-white text-slate-900 transition-colors duration-300">

      {pageLoading && <CoinLoader />}

      {/* SIDEBAR — full height, never scrolls */}
      <div className={`
        h-full flex-shrink-0 transition-all duration-300
        ${sidebarOpen ? "w-[280px]" : "w-[74px]"}
      `}>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      {/* MAIN COLUMN — takes remaining width, scrolls independently */}
      <div className="flex-1 flex flex-col min-w-0 h-full">

        {/* TOPBAR — fixed at top, never scrolls away */}
        <div className="flex-shrink-0">
          <Topbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>

        {/* PAGE CONTENT — only this scrolls */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>

      </div>
    </div>
  );
};

export default MainLayout;