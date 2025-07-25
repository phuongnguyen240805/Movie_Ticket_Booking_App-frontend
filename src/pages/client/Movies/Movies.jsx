import MovieCard from "@/components/MovieCard";
import Pagination from "@/components/Pagination";
import { useAppContext } from "@/context/AppContext";

import { Helmet } from 'react-helmet-async';

function Movies() {

    const { shows } = useAppContext();

    return shows.length > 0 ? (
        <div className="relative my-40 mb-30 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
            <Helmet>
                <title>Movie Ticket Booking - Movies</title>
            </Helmet>

            <Pagination title='Action | Horror'>
                {shows.map(movie => (
                    <MovieCard key={movie._id} movie={movie} />
                ))}
            </Pagination>

            <Pagination title='Family | Comedy '>
                {shows.map(movie => (
                    <MovieCard key={movie._id} movie={movie} />
                ))}
            </Pagination>

            <Pagination title='Horror | Thriller'>
                {shows.map(movie => (
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