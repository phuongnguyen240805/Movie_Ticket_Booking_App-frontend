import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router";

import { routesConfig } from "@/configs";
import { fetchIsAdmin, fetchDashboardData, getAllShows, getAllBookings } from "@/services/adminService";
import { fetchNowPlayingMovies, fetchShows } from "@/services/showService";
import { fetchFavoriteMovies, getMyBookings } from "@/services/userService";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

function AppProvider({ children }) {

    const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
    const trailer_base_url = import.meta.env.VITE_TRAILER_YTB_URL;

    // ======================= ADMIN API (/api/admin) ==============================
    const [isAdmin, setIsAdmin] = useState(false);
    const [dashboardData, setDashboardData] = useState({});
    const [listShows, setListShows] = useState([]);
    const [listBookings, setListBookings] = useState([]);

    // ======================= SHOW API (/api/show) ==============================
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [shows, setShows] = useState([]);

    // ======================= USER API (/api/user) ==============================
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [bookings, setBookings] = useState([]);

    // ===================== URL pay ================================

    const [isLoading, setIsLoading] = useState(true);
    const { user } = useUser();
    const { getToken } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            // ======================= ADMIN API (/api/admin) ==============================
            fetchIsAdmin({ getToken, setIsAdmin, navigate, location, routesConfig });
            fetchDashboardData({ getToken, setDashboardData, setIsLoading, });
            getAllShows({ getToken, setListShows, setIsLoading });
            getAllBookings({ getToken, setListBookings, setIsLoading });
            // ======================= USER API (/api/user) ==============================
            fetchFavoriteMovies({ getToken, setFavoriteMovies });
            getMyBookings({ getToken, setBookings });
            // ======================= SHOW API (/api/show) ==============================
            fetchNowPlayingMovies({ getToken, setNowPlayingMovies });
        }
    }, [user, navigate]);

    useEffect(() => {
        fetchShows({ setShows });
    }, [navigate]);

    const value = {
        // admin routes 
        isAdmin, listShows, dashboardData, listBookings,
        // show routes
        shows, nowPlayingMovies,
        // user routes 
        favoriteMovies, bookings,
        // generate
        axios, user, isLoading, image_base_url, trailer_base_url, getToken, navigate,
        setFavoriteMovies, 
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