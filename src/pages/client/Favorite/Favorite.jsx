import MovieCard from "@/components/MovieCard";
import Pagination from "@/components/Pagination";
import { useAppContext } from "@/context/AppContext";
import useTitle from "@/hooks";

function Favorite() {

    useTitle('Movie Ticket Booking - Favorite');

    const { favoriteMovies } = useAppContext();

    return favoriteMovies.length > 0 ? (
        <div className="relative my-40 mb-30 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">

            <Pagination title="Your Favorite Movies">
                {favoriteMovies.map(movie => (
                    <MovieCard key={movie._id} movie={movie} />
                ))}
            </Pagination>

        </div>
    ) : (
        <div className="flex flex-col justify-center items-center h-screen">
            <h1 className="text-3xl font-bold text-center">No movies available</h1>
        </div>
    );
}

export default Favorite;