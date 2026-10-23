import axios from "axios";

// [GET]: /api/show/all
export const fetchShows = async ({ setShows, setShowsLoading = () => {}, setShowsError = () => {} }) => {
    setShowsLoading(true);
    setShowsError('');
    try {
        const { data } = await axios.get('/api/show/all');
        if (data.success && Array.isArray(data.shows)) {
            // A movie can appear once per scheduled show in the backend response.
            setShows([...new Map(data.shows.filter(movie => movie?._id).map(movie => [movie._id, movie])).values()]);
        } else {
            setShowsError(data.message || 'Unable to load movies. Please try again.');
        }
    } catch (error) {
        setShowsError(error.message || 'Unable to load movies. Please try again.');
    } finally {
        setShowsLoading(false);
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
export const fetchShow = async (id) => {
    try {
        const { data } = await axios.get(`/api/show/${id}`);

        return data;
    } catch (error) {
        console.error(error.message);
    }
};

// [PORT]: /api/show/add
export const addShow = async (payload, getToken) => {
    try {
        const { data } = await axios.post('/api/show/add', payload, {
            headers: { Authorization: `Bearer ${await getToken()}` }
        });

        return data;
    } catch (error) {
        console.error(error.message);
    }
};
