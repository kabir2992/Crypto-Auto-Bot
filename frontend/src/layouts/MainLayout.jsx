import {
  useEffect,
  useState
} from "react";

import {
  useLocation
} from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";

import Topbar from "../components/layout/Topbar";

import CoinLoader from "../components/loaders/CoinLoader";

const MainLayout = ({
  children
}) => {

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [pageLoading, setPageLoading] =
    useState(false);

  const location =
    useLocation();

  useEffect(() => {

    setPageLoading(true);

    const timer =
      setTimeout(() => {

        setPageLoading(false);

      }, 800);

    return () =>
      clearTimeout(timer);

  }, [location.pathname]);

  return (

    <div className="
      min-h-screen
      bg-slate-950
      text-white
      flex
      overflow-hidden
    ">

      {/* LOADER */}

      {
        pageLoading && (
          <CoinLoader />
        )
      }

      {/* SIDEBAR */}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* MAIN */}

      <div className="
        flex-1
        flex
        flex-col
        min-w-0
      ">

        {/* TOPBAR */}

        <Topbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* PAGE */}

        <main className="
          flex-1
          overflow-y-auto
          p-4
          md:p-6
        ">

          {children}

        </main>

      </div>

    </div>

  );

};

export default MainLayout;