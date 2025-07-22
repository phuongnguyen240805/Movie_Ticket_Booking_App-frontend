import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { routesConfig } from "@/configs";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

function AppProvider({ children }) {

    const [isAdmin, setIsAdmin] = useState(false);
    const [shows, setShows] = useState([]);
    const [favoriteMovies, setFavoriteMovies] = useState([]);

    const { user } = useUser();
    const { getToken } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

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
            fetchIsAdmin();
            fetchFavoriteMovies();
        }
    }, [user]);

    useEffect(() => {
        fetchShows();
    }, []);

    const value = {
        axios,
        user,
        isAdmin,
        shows,
        favoriteMovies,
        getToken,
        navigate,
        fetchIsAdmin,
        fetchFavoriteMovies
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