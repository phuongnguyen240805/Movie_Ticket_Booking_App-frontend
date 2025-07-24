import { assets } from '@/assets/assets';
import { routesConfig } from '@/configs';

import { Link } from 'react-router-dom';

const AdminNavbar = () => {

    return (
        <nav className="flex items-center justify-between px-6 md:px-10 h-16 border-b border-gray-300/30">
            <Link to={routesConfig.homePage} className='focus:outline-none focus:ring-0 focus:border-none'>
                <img src={assets.logo} alt="logo" className="w-36 h-auto" />
            </Link>
        </nav>
    );
};

export default AdminNavbar;