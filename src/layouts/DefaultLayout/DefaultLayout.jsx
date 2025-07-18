import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { Toaster } from "react-hot-toast";

function DefaultLayout({ children }) {

    return (
        <>
            <Toaster />
            <Navbar />
            {children}
            <Footer />
        </>
    );
}

export default DefaultLayout;