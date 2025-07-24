import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ScrollToTopButton from "@/components/ScrollToTopButton";

import { useRef } from "react";
import { Toaster } from "react-hot-toast";

function AdminLayout({ children }) {

    const contentRef = useRef(null);

    return (
        <>
            <Toaster />
            <AdminNavbar />
            <div className="flex">
                <AdminSidebar />
                <div ref={contentRef}
                    className="flex-1 px-4 py-10 h-[calc(100vh-64px)] overflow-y-auto">
                    {children}
                    <ScrollToTopButton scrollContainer={contentRef} />
                </div>
            </div>
        </>
    );
}

export default AdminLayout;