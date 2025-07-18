import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUp, MenuIcon, SearchIcon, TicketPlus, XIcon } from "lucide-react";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";
import classNames from "classnames/bind";

import styles from './Navbar.module.scss';
import { routesConfig } from "@/configs";
import { assets } from "@/assets/assets";
import Button from "@/components/Button";

const cx = classNames.bind(styles);

const menuItems = [
    { label: "Home", to: routesConfig.homePage },
    { label: "Movies", to: routesConfig.moviesPage },
    { label: "Theaters", to: routesConfig.homePage },
    { label: "Releases", to: routesConfig.homePage },
    { label: "Favorites", to: routesConfig.favoritePage },
];

function Navbar() {

    const [isOpen, setIsOpen] = useState(false);
    const [btnOnTop, setBtnOnTop] = useState(false);
    const { user } = useUser();
    const { openSignIn } = useClerk();
    const navigate = useNavigate();

    const handleCloseMenu = () => setIsOpen(false);

    const handleLogin = async () => {
        await openSignIn({ fallbackRedirectUrl: window.location.href });
    };

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
        <nav className={cx(
            btnOnTop && "bg",
            "fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-2.5"
        )}>
            <Link to={routesConfig.homePage} className="max-md:flex-1">
                <img src={assets.logo} alt="" className="w-36 h-auto" />
            </Link>

            <div className={cx(
                'menu-container',
                { 'max-md:w-full rounded-none': isOpen, 'max-md:w-0 rounded-full': !isOpen }
            )}>
                <XIcon
                    className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
                    onClick={() => setIsOpen(false)}
                />
                {menuItems.map(item => (
                    <Link
                        key={item.label}
                        className={cx('menu-item')}
                        to={item.to}
                        onClick={handleCloseMenu}
                    >
                        {item.label}
                    </Link>
                ))}
            </div>

            <div className="flex items-center gap-8">
                <SearchIcon className='max-md:hidden w-6 h-6 cursor-pointer' />
                {
                    !user ? (
                        <Button
                            primary
                            className="h-10 w-20 transition active:scale-95"
                            onClick={handleLogin}>
                            Login
                        </Button>
                    ) : (
                        <UserButton>
                            <UserButton.MenuItems>
                                <UserButton.Action
                                    label="My Bookings"
                                    labelIcon={<TicketPlus className={cx('user-item')} />}
                                    onClick={() => navigate(routesConfig.myBookingsPage)}
                                />
                            </UserButton.MenuItems>
                        </UserButton>
                    )
                }
            </div>

            <MenuIcon
                className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            />

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
}

export default Navbar;