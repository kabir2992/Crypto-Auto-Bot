import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import MobileSidebar from "../components/layout/MobileSidebar";
import Topbar from "../components/layout/Topbar";
import MobileSidebar from "../components/layout/MobileSidebar";
import CoinLoader from "../components/loaders/CoinLoader";

const MainLayout = ({
  children
}) => {

  // =========================
  // DESKTOP SIDEBAR
  // =========================

  const [
    sidebarOpen,
    setSidebarOpen
  ] = useState(true);

  // =========================
  // MOBILE SIDEBAR
  // =========================

  const [
    mobileSidebarOpen,
    setMobileSidebarOpen
  ] = useState(false);

  // =========================
  // PAGE LOADER
  // =========================

  const [
    pageLoading,
    setPageLoading
  ] = useState(false);

  const location =
    useLocation();

  // =========================
  // PAGE TRANSITION LOADER
  // =========================

  useEffect(() => {

    setPageLoading(true);

    const timer =
      setTimeout(() => {

        setPageLoading(false);

      }, 700);

    return () =>
      clearTimeout(timer);

  }, [location.pathname]);

  // =========================
  // CLOSE MOBILE SIDEBAR
  // ON ROUTE CHANGE
  // =========================

  useEffect(() => {

    setMobileSidebarOpen(false);

  }, [location.pathname]);

  return (

    <div className="
      h-screen
      overflow-hidden
      bg-slate-100
      dark:bg-[#020617]
      text-slate-900
      dark:text-white
      transition-colors
      duration-300
      flex
    ">

      {/* LOADER */}

      {
        pageLoading && (
          <CoinLoader />
        )
      }

      {/* ========================= */}
      {/* DESKTOP SIDEBAR */}
      {/* ========================= */}

      <div className="
        hidden
        md:flex
        h-full
        flex-shrink-0
      ">

        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

      </div>

      {/* ========================= */}
      {/* MOBILE SIDEBAR */}
      {/* ========================= */}

      <MobileSidebar
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
      />

      {/* ========================= */}
      {/* MAIN CONTENT */}
      {/* ========================= */}

      <div className="
        flex-1
        min-w-0
        h-full
        flex
        flex-col
        overflow-hidden
      ">

        {/* TOPBAR */}

        <Topbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />

        {/* PAGE */}

        <main className="
          flex-1
          overflow-y-auto
          overflow-x-hidden
          p-4
          sm:p-5
          md:p-6
          lg:p-8
        ">

          <div className="
            w-full
            max-w-[1800px]
            mx-auto
          ">

            {children}

          </div>

        </main>

      </div>

    </div>

  );

};

export default MainLayout;