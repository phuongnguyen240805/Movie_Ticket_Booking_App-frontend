import axios from "axios";
import toast from "react-hot-toast";

// [GET]: /api/user/favorites
export const fetchFavoriteMovies = async ({ getToken, setFavoriteMovies }) => {
    try {
        const { data } = await axios.get('/api/user/favorites', {
            headers: { Authorization: `Bearer ${await getToken()}` }
        });

        data.success ? setFavoriteMovies(data?.movies) : toast.error(data.message);
    } catch (error) {
        console.error(error.message);
    }
};

// [GET]: /api/user/bookings
export const getMyBookings = async ({ getToken, setBookings }) => {
    try {
        const { data } = await axios.get('/api/user/bookings', {
            headers: { Authorization: `Bearer ${await getToken()}` }
        });

        if (data.success) setBookings(data.bookings);
    } catch (error) {
        console.error(error.message);
    }
};
