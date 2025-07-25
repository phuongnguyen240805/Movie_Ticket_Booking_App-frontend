import axios from "axios";
import toast from "react-hot-toast";

// [GET]: /api/admin/is-admin
export const fetchIsAdmin = async ({ getToken, setIsAdmin, navigate, location, routesConfig }) => {
    try {
        const { data } = await axios.get('/api/admin/is-admin', {
            headers: { Authorization: `Bearer ${await getToken()}` }
        });

        setIsAdmin(data.isAdmin);

        if (!data.isAdmin && location.pathname.startsWith(routesConfig.admin)) {
            navigate(routesConfig.homePage);
            toast.error('You are not authorized to access admin dashboard');
        }
    } catch (error) {
        console.error(error.message);
    }
};

// [GET]: /api/admin/dashboard
export const fetchDashboardData = async ({ getToken, setDashboardData, setIsLoading }) => {
    try {
        const { data } = await axios.get('/api/admin/dashboard', {
            headers: { Authorization: `Bearer ${await getToken()}` }
        });

        if (data.success) {
            setDashboardData(data.dashboardData);
            setIsLoading(false);
        } else {
            return toast.error(data.message);
        }
    } catch (error) {
        console.log('Error fetching dashboard data: ', error.message);
    }
};

// [GET]: /api/admin/all-shows
export const getAllShows = async ({ getToken, setListShows, setIsLoading }) => {
    try {
        const { data } = await axios.get('/api/admin/all-shows', {
            headers: { Authorization: `Bearer ${await getToken()}` }
        });

        setListShows(data.shows);
        setIsLoading(false);
    } catch (error) {
        console.log('Error fetching all shows data: ', error.message);
    }
};

// [GET]: /api/admin/all-bookings
export const getAllBookings = async ({ getToken, setListBookings, setIsLoading }) => {
    try {
        const { data } = await axios.get('/api/admin/all-bookings', {
            headers: { Authorization: `Bearer ${await getToken()}` }
        });

        setListBookings(data.bookings);
        setIsLoading(false);
    } catch (error) {
        console.log('Error fetching all bookings data: ', error.message);
    }
};
