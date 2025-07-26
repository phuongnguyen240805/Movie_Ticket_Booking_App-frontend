import MovieCard from "@/components/MovieCard";
import Pagination from "@/components/Pagination";
import { useAppContext } from "@/context/AppContext";

import { Helmet } from 'react-helmet-async';

function Movies() {

    const { shows } = useAppContext();

    // phân loại phim
    const movieClassification = (genres) => {
        const filteredMovies = shows.filter(movie =>
            Array.isArray(movie.genres) &&
            movie.genres.some(genre => genres.includes(
                typeof genre === 'string' ? genre : (genre?.name || '')
            )));

        return filteredMovies;
    };

    return shows.length > 0 ? (
        <div className="relative my-40 mb-30 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
            <Helmet>
                <title>Movie Ticket Booking - Movies</title>
            </Helmet>


            <Pagination title='Horror | Thriller | Action'>
                {movieClassification(['Horror', 'Thriller', 'Action']).map(movie => (
                    <MovieCard key={movie._id} movie={movie} />
                ))}
            </Pagination>

            <Pagination title='Family | Animation '>
                {movieClassification(['Family', 'Animation']).map(movie => (
                    <MovieCard key={movie._id} movie={movie} />
                ))}
            </Pagination>

            <Pagination title='Romance | Comedy'>
                {movieClassification(['Romance', 'Comedy']).map(movie => (
                    <MovieCard key={movie._id} movie={movie} />
                ))}
            </Pagination>

        </div>
    ) : (
        <div className="flex flex-col justify-center items-center h-screen">
            <Helmet>
                <title>Movie Ticket Booking - Movies</title>
            </Helmet>

            <h1 className="text-3xl font-bold text-center">No movies available</h1>
        </div>
    );
}

export default Movies;