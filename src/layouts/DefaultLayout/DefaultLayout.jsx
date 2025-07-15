import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

function DefaultLayout({ children }) {
    return (
        <div>
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}

export default DefaultLayout;