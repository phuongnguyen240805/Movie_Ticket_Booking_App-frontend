import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";

import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router";

function AdminLayout({ children }) {

    return (
        <>
            <Toaster />
            <AdminNavbar />
            <div className="flex">
                <AdminSidebar />
                <div className="flex-1 px-4 py-10 md:px-10 h-[calc(100vh - 64px)] overflow-y-auto">
                    <Outlet />
                    {children}
                </div>
            </div>
        </>
    );
}

export default AdminLayout;