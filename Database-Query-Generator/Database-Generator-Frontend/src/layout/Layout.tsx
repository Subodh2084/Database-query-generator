import { Outlet } from "react-router-dom";
import { HomeSidebar } from "../components/HomeSidebar";
import { SidebarProvider } from "../components/ui/sidebar";

const Layout = () => {
  return (
    <>
      <div className="min-h-screen bg-[#1e1e1e] text-white flex">
        <SidebarProvider>
          <HomeSidebar />
          <div className="p-10 w-full">
            <Outlet />
          </div>
        </SidebarProvider>
      </div>
    </>
  );
};

export default Layout;
