import { assets } from "@/assets/assets";
import { routesConfig } from "@/configs";

import { LayoutDashboardIcon, ListCollapseIcon, ListIcon, PlusSquareIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

const adminNavLinks = [
    { label: "Dashboard", to: routesConfig.dashboardPage, icon: LayoutDashboardIcon },
    { label: "Add Shows", to: routesConfig.addShowsPage, icon: PlusSquareIcon },
    { label: "List Shows", to: routesConfig.listShowsPage, icon: ListIcon },
    { label: "List Bookings", to: routesConfig.listBookingsPage, icon: ListCollapseIcon },
];

const admin = {
    firstName: "Phuong",
    lastName: "Nguyen",
    imageUrl: assets.profile,
}

function AdminSidebar() {

    return (
        <div className="h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-gray-300/20 text-sm">
            <img
                className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto"
                src={admin.imageUrl}
                alt="sidebar"
            />
            <p className="mt-2 text-base max-md:hidden">
                {admin.firstName} {admin.lastName}
            </p>
            <div className="w-full">
                {adminNavLinks.map(link => (
                    <NavLink
                        key={link.label}
                        to={link.to}
                        end
                        className={({ isActive }) =>
                            `relative flex items-center max-md:justify-center gap-2 w-full py-2.5 min-md:pl-10 first:mt-6
                            text-gray-400 ${isActive ? 'bg-primary/15 text-primary group' : ''}`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <link.icon className="w-5 h-5" />
                                <p className="max-md:hidden">{link.label}</p>
                                <span
                                    className={`w-1.5 h-10 rounded-l right-0 absolute ${isActive ? 'bg-primary' : ''}`}
                                    style={{ right: 0 }}
                                ></span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </div>
    );
}

export default AdminSidebar;