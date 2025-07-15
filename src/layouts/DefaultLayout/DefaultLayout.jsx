import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { useLocation } from "react-router";
import { Toaster } from "react-hot-toast";

function DefaultLayout({ children }) {

    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <>
            <Toaster />
            {!isAdminRoute && <Navbar />}
            {children}
            {!isAdminRoute && <Footer />}
        </>
    );
}

export default DefaultLayout;