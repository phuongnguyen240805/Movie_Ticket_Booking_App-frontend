import { routesConfig } from "@/configs";
import { UserButton } from "@clerk/clerk-react";

import { LayoutDashboardIcon, ListCollapseIcon, ListIcon, PlusSquareIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

const adminNavLinks = [
    { label: "Dashboard", to: routesConfig.dashboardPage, icon: LayoutDashboardIcon },
    { label: "Add Shows", to: routesConfig.addShowsPage, icon: PlusSquareIcon },
    { label: "List Shows", to: routesConfig.listShowsPage, icon: ListIcon },
    { label: "List Bookings", to: routesConfig.listBookingsPage, icon: ListCollapseIcon },
];

function AdminSidebar() {

    return (
        <div className="h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-gray-300/20 text-sm">
            <div className="flex flex-col items-center">
                <UserButton />
                <p className="mt-2 text-base max-md:hidden">
                    {typeof window !== "undefined" && window.Clerk && window.Clerk.user
                        ? window.Clerk.user.username || window.Clerk.user.firstName + " " + window.Clerk.user.lastName
                        : ""}
                </p>
            </div>

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