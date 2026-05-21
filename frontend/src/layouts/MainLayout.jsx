import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/TopBar";

const MainLayout = ({ children }) => {

  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (

    <div className="flex min-h-screen bg-[#050816] text-white">

      <Sidebar
        sidebarOpen={sidebarOpen}
      />

      <div
        className={`
          flex-1
          transition-all
          duration-300
          ${sidebarOpen ? "ml-[260px]" : "ml-[90px]"}
        `}
      >

        <Topbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="p-6">
          {children}
        </div>

      </div>

    </div>

  );

};

export default MainLayout;