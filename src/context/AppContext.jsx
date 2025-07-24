import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";

import { routesConfig } from "@/configs";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

function AppProvider({ children }) {

    const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

    const [isAdmin, setIsAdmin] = useState(false);
    const [shows, setShows] = useState([]);
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [dashboardData, setDashboardData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [listShows, setListShows] = useState([]);
    const [listBookings, setListBookings] = useState([]);


    const { user } = useUser();
    const { getToken } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // ======================= ADMIN API (/api/admin) ==============================
    // [GET]: /api/admin/is-admin
    const fetchIsAdmin = async () => {
        try {
            const { data } = await axios.get('/api/admin/is-admin', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });

            setIsAdmin(data.isAdmin);

            if (!data.isAdmin && location.pathname.startsWith(routesConfig.admin)) {
                navigate(routesConfig.homePage);
                toast.error('You are not authorized to access admin dashboard');
            };
        } catch (error) {
            console.error(error.message);
        };
    };

    // [GET]: /api/admin/dashboard
    const fetchDashboardData = async () => {
        try {
            const { data } = await axios.get('/api/admin/dashboard', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });

            if (data.success) {
                setDashboardData(data.dashboardData);
                setIsLoading(false);
            } else {
                return toast.error(data.message);
            };
        } catch (error) {
            console.log('Error fetching dashboard data: ', error.message);
        };
    };

    // [GET]: /api/admin/all-shows
    const getAllShows = async () => {
        try {
            const { data } = await axios.get('/api/admin/all-shows', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });

            setListShows(data.shows);
            setIsLoading(false);
        } catch (error) {
            console.log('Error fetching all shows data: ', error.message);
        };
    };

    // [GET]: /api/admin/all-bookings
    const getAllBookings = async () => {
        try {
            const { data } = await axios.get('/api/admin/all-bookings', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });

            setListBookings(data.bookings);
            setIsLoading(false);
        } catch (error) {
            console.log('Error fetching all bookings data: ', error.message);
        };
    };


    // ======================= SHOW API (/api/show) ==============================
    const fetchShows = async () => {
        try {
            const { data } = await axios.get('/api/show/all');
            if (data.success) {
                setShows(data.shows);
            } else {
                toast.error(data.message);
            };
        } catch (error) {
            console.error(error.message);
        };
    };

    const fetchNowPlayingMovies = async () => {
        try {
            const { data } = await axios.get('/api/show/now-playing', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });

            if (data.success) setNowPlayingMovies(data.movies);
        } catch (error) {
            console.log('Error fetching movie: ', error.message);
        };
    };


    // ======================= USER API (/api/user) ==============================
    const fetchFavoriteMovies = async () => {
        try {
            const { data } = await axios.get('/api/user/favorites', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });

            data.success ? setFavoriteMovies(data?.movies) : toast.error(data.message);
        } catch (error) {
            console.error(error.message);
        };
    };

    useEffect(() => {
        if (user) {
            // admin
            fetchIsAdmin();
            fetchDashboardData();
            getAllShows();
            getAllBookings();
            // user
            fetchFavoriteMovies();
            // show
            fetchNowPlayingMovies();
        }
    }, [user]);

    useEffect(() => {
        fetchShows();
    }, []);

    const value = {
        // admin routes 
        isAdmin, listShows, dashboardData, listBookings,
        // show routes
        shows, nowPlayingMovies,
        // user routes 
        favoriteMovies,
        // generate
        axios, user, isLoading, image_base_url, getToken, navigate,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

const useAppContext = () => useContext(AppContext);

// eslint-disable-next-line react-refresh/only-export-components
export { AppContext, AppProvider, useAppContext };