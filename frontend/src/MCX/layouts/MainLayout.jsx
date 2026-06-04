import Sidebar from "../components/sidebar/Sidebar";
import Topbar from "../components/topbar/Topbar";
import Dashboard from "../pages/Dashboard";

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-[#0B0F14] text-white overflow-hidden">

      <Sidebar />

      <div className="flex flex-col flex-1">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-4">
          <Dashboard />
        </main>
      </div>

    </div>
  );
}