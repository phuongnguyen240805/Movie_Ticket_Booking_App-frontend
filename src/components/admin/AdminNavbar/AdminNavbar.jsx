import { assets } from '@/assets/assets';
import Button from '@/components/Button';
import { routesConfig } from '@/configs';
import { ArrowUp } from 'lucide-react';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AdminNavbar = () => {

    const [btnOnTop, setBtnOnTop] = useState(false);

    const scrollTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    // xử lý btn cuộn
    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setBtnOnTop(window.scrollY >= 150);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll);

        // Cleanup function
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <nav className="flex items-center justify-between px-6 md:px-10 h-16 border-b border-gray-300/30">
            <Link to={routesConfig.admin}>
                <img src={assets.logo} alt="logo" className="w-36 h-auto" />
            </Link>

            {
                // button cuộn
                btnOnTop && (
                    <Button
                        primary
                        onClick={scrollTop}
                        className="group fixed bottom-20 right-10 w-14 h-14 rounded-full"
                    >
                        <ArrowUp className="group-hover:-translate-y-1 transition" />
                    </Button>
                )
            }
        </nav>
    );
};

export default AdminNavbar;