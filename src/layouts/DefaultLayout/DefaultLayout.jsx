import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieAssistant from '@/components/MovieAssistant';

import { Toaster } from "react-hot-toast";

function DefaultLayout({ children }) {

    return (
        <>
            <Toaster />
            <Navbar />
            {children}
            <Footer />
            <MovieAssistant />
        </>
    );
}

export default DefaultLayout;
