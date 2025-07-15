import { routesConfig } from "@/configs";
import { assets } from "@/assets/assets";
import styles from './Navbar.module.scss';

import classNames from "classnames/bind";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from "lucide-react";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";

const cx = classNames.bind(styles);

function Navbar() {

    const [isOpen, setIsOpen] = useState(false);
    const { user } = useUser();
    const { openSignIn } = useClerk();
    const navigate = useNavigate();

    const handleCloseMenu = () => {
        scrollTo(0, 0);
        setIsOpen(false);
    };

    const handleLogin = async () => {
        await openSignIn({
            fallbackRedirectUrl: window.location.href
        });
    };

    return (
        <nav className="fixed top-0 left-0 z-50 w-full flex items-center 
            justify-between px-6 md:px-16 lg:px-36 py-5">
            <Link
                to={routesConfig.homePage}
                className="max-md:flex-1">
                <img src={assets.logo} alt="" className="w-36 h-auto" />
            </Link>

            {/* menu */}
            <div className={cx(
                'menu-container',
                { 'max-md:w-full rounded-none': isOpen, 'max-md:w-0 rounded-full': !isOpen }
            )}>

                <XIcon
                    className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
                    onClick={() => { setIsOpen(!isOpen) }}
                />

                <Link
                    to={routesConfig.homePage}
                    onClick={handleCloseMenu}>Home</Link>
                <Link
                    to={routesConfig.moviesPage}
                    onClick={handleCloseMenu}>Movies</Link>
                <Link
                    to={routesConfig.homePage}
                    onClick={handleCloseMenu}>Theaters</Link>
                <Link
                    to={routesConfig.homePage}
                    onClick={handleCloseMenu}>Releases</Link>
                <Link
                    to={routesConfig.favoritePage}
                    onClick={handleCloseMenu}>Favorites</Link>
            </div>

            <div className="flex items-center gap-8">
                <SearchIcon className='max-md:hidden w-6 h-6 cursor-pointer' />
                {
                    !user ? (
                        <button
                            className='px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull 
                            transition rounded-full font-medium cursor-pointer'
                            onClick={handleLogin}
                        >Login</button>
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
        </nav>
    );
}

export default Navbar;