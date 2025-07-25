import axios from "axios";
import toast from "react-hot-toast";

// [GET]: /api/show/all
export const fetchShows = async ({ setShows }) => {
    try {
        const { data } = await axios.get('/api/show/all');
        if (data.success) {
            setShows(data.shows);
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        console.error(error.message);
    }
};

// [GET]: /api/show/now-playing
export const fetchNowPlayingMovies = async ({ getToken, setNowPlayingMovies }) => {
    try {
        const { data } = await axios.get('/api/show/now-playing', {
            headers: { Authorization: `Bearer ${await getToken()}` }
        });

        if (data.success) setNowPlayingMovies(data.movies);
    } catch (error) {
        console.log('Error fetching movie: ', error.message);
    }
};

// [GET]: /api/show/:movieId
export const getShow = async ({ id, setShow }) => {
    try {
        const { data } = await axios.get(`/api/show/${id}`);

        if (data.success) setShow(data);
    } catch (error) {
        console.error(error.message);
    }
};

