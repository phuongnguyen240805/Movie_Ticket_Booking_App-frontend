import { dummyShowsData } from "@/assets/assets";
import BlurCircle from "@/components/BlurCircle";
import MovieCard from "@/components/MovieCard";
import Pagination from "@/components/Pagination";

function Favorite() {
    return dummyShowsData.length > 0 ? (
        <div className="relative my-40 mb-30 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">

            <BlurCircle top="100px" left="100px" />
            <BlurCircle bottom="100px" right="100px" />

            <Pagination title="Your Favorite Movies">
                {dummyShowsData.map(movie => (
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