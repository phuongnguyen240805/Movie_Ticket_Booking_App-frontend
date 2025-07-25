import BlurCircle from "@/components/BlurCircle";
import Button from "@/components/Button";
import DateSelect from "@/components/DateSelect";
import Loading from "@/components/Loading";
import MovieCard from "@/components/MovieCard";
import { routesConfig } from "@/configs";
import timeFormat from "@/lib/timeFormat";
import styles from "./MovieDetails.module.scss";
import TrailerModal from "@/components/TrailerModal";
import { useAppContext } from "@/context/AppContext";
import { fetchFavoriteMovies } from "@/services/userService";

import classNames from "classnames/bind";
import { Heart, PlayCircleIcon, StarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";

const cx = classNames.bind(styles);

function MovieDetails() {

    const {
        user, shows, axios, image_base_url,
        trailer_base_url, getToken, favoriteMovies,
        setFavoriteMovies
    } = useAppContext();

    const navigate = useNavigate();
    const { id } = useParams();
    const [show, setShow] = useState(null);
    const [trailerKey, setTrailerKey] = useState();
    const [showTrailer, setShowTrailer] = useState(false);
    const [intro, setIntro] = useState([]);

    // [GET]: /api/show/:showId
    const getShow = async ({ id, setShow }) => {
        try {
            const { data } = await axios.get(`/api/show/${id}`);

            if (data.success) setShow(data);
        } catch (error) {
            console.error(error.message);
        }
    };

    // [POST]: /api/user/update-favorite
    const handleFavorite = async () => {
        try {
            if (!user) return toast.error('Please login to proceed');

            const { data } = await axios.post('/api/user/update-favorite', { movieId: id }, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });

            if (data.success) {
                await fetchFavoriteMovies({ getToken, setFavoriteMovies });
                toast.success(data.message);
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    // trailer
    useEffect(() => {
        if (!show || !Array.isArray(show.trailer)) {
            setTrailerKey(undefined);
            return;
        }
        const trailer = show.trailer.find(
            (video) => video.site === "YouTube" && video.type === "Trailer"
        );

        setTrailerKey(trailer ? trailer.key : undefined);
    }, [show]);

    useEffect(() => {
        if (!id) return;

        getShow({ id, setShow });
    }, [id]);

    // get ramdom film intro
    useEffect(() => {
        const randomShows = shows.slice().sort(() => Math.random() - 0.5).slice(0, 4);

        setIntro(randomShows);
    }, [navigate, shows]);

    return show ? (
        <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
            <Helmet>
                <title>Movie Ticket Booking - Movie Details</title>
            </Helmet>

            <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
                <img src={image_base_url + show.movie?.poster_path} alt="" className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover" />

                <div className="relative flex flex-col gap-3">
                    <BlurCircle top="-100px" left="-100px" />

                    <p className="text-primary">ENGLISH</p>
                    <h1 className='text-4xl font-semibold max-w-96 text-balance'>{show.movie.title}</h1>

                    <div className='flex items-center gap-2 text-gray-300'>
                        <StarIcon className="w-5 h-5 text-primary fill-primary" />
                        {show.movie.vote_average.toFixed(1)} User Rating
                    </div>

                    <p className='text-gray-400 mt-2 text-sm leading-tight max-w-xl'>{show.movie.overview}</p>

                    <p>
                        {timeFormat(show.movie.runtime)} • {show.movie.genres.map(genre => genre.name).join(", ")} • {show.movie.release_date.split("-")[0]}
                    </p>

                    <div className="flex items-center flex-wrap gap-4 mt-4">
                        <Button
                            secondary
                            leftIcon={<PlayCircleIcon className="w-5 h-5" />}
                            className="px-7 py-3 text-sm "
                            onClick={() => setShowTrailer(true)}
                        >
                            Watch Trailer
                        </Button>
                        {showTrailer && (
                            // show trailer
                            <TrailerModal url={trailer_base_url + trailerKey} onClose={() => setShowTrailer(false)} />
                        )}

                        <Button
                            primary
                            href="#dateSelect"
                            className={cx("btn-ticket", "px-10 py-3 text-sm ")}>
                            Buy Tickets
                        </Button>

                        <Button
                            rounded
                            onClick={handleFavorite}
                            className="h-11 w-11 px-2.5">
                            <Heart className={`w-5 h-5 ${favoriteMovies.find(movie => movie._id === id) ? 'text-primary fill-primary' : ''}`} />
                        </Button>
                    </div>

                </div>
            </div>

            <p className='text-lg font-medium mt-20'>Your Favorite Cast</p>
            <div className='overflow-x-auto no-scrollbar mt-8 pb-4'>
                <div className='flex items-center gap-4 w-max px-4'>
                    {show.movie.casts.slice(0, 12).map((cast, index) => (
                        <div key={index} className='flex flex-col items-center text-center'>
                            <img src={image_base_url + cast.profile_path} alt="" className='rounded-full h-20 md:h-20 aspect-square object-cover' />
                            <p className="font-medium text-xs mt-3">{cast.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            <DateSelect dateTime={show.dateTime} id={id} />

            <p className="text-lg font-medium mt-20 mb-8">You May Also Like</p>
            <div className="flex justify-center flex-wrap max-sm:justify-center gap-8">
                {intro.map((movie, index) => (
                    <MovieCard key={index} movie={movie} />
                ))}
            </div>

            <div className="flex justify-center mt-20">
                <Button
                    primary
                    className="px-10 py-3 "
                    onClick={() => navigate(routesConfig.moviesPage)}
                >
                    Show more
                </Button>
            </div>

        </div>
    ) : (
        <Loading />
    );
}

export default MovieDetails;