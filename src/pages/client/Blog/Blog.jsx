import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import useTitle from '@/hooks';
import { filterMovies, genreNames } from '@/lib/movieCatalog';
import CatalogMovieCard from '@/components/CatalogMovieCard';
import CatalogStatus from '@/components/CatalogStatus';
import { routesConfig } from '@/configs';

const PAGE_SIZE = 6;

export default function Blog() {
    useTitle('Movie Ticket Booking - MovieHub');
    const { shows, showsLoading, showsError } = useAppContext();
    const [search, setSearch] = useState('');
    const [genre, setGenre] = useState('');
    const [sort, setSort] = useState('newest');
    const [page, setPage] = useState(1);
    const movies = filterMovies(shows, { search, genre, sort });
    const genres = [...new Set(shows.flatMap(genreNames))].sort();
    const totalPages = Math.ceil(movies.length / PAGE_SIZE);
    const currentPage = Math.min(page, Math.max(1, totalPages));
    const featured = filterMovies(shows, { sort: 'rating' }).slice(0, 3);

    return <div className="min-h-screen pt-28 pb-12 px-6 md:px-16 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">MovieHub</h1>
        <p className="text-gray-400 mb-8">Explore movies in our cinema, watch trailers, and find your next favorite.</p>
        <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-4 bg-gray-900/80 p-4 rounded-xl mb-6">
                    <input aria-label="Search movies" placeholder="Search movies…" value={search} onChange={event => { setSearch(event.target.value); setPage(1); }} className="bg-gray-800 rounded px-3 py-2 min-w-0 flex-1" />
                    <select aria-label="Genre" value={genre} onChange={event => { setGenre(event.target.value); setPage(1); }} className="bg-gray-800 rounded px-3 py-2">
                        <option value="">All genres</option>{genres.map(name => <option key={name}>{name}</option>)}
                    </select>
                    <select aria-label="Sort movies" value={sort} onChange={event => { setSort(event.target.value); setPage(1); }} className="bg-gray-800 rounded px-3 py-2">
                        <option value="newest">Newest releases</option><option value="oldest">Oldest releases</option><option value="rating">Highest rated</option>
                    </select>
                </div>
                <CatalogStatus />
                {!showsLoading && !showsError && <>
                    <p className="text-sm text-gray-400 mb-4">{movies.length} movies</p>
                    {movies.length === 0 && <p className="py-10 text-center text-gray-400">No movies found.</p>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {movies.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map(movie => <CatalogMovieCard key={movie._id} movie={movie} />)}
                    </div>
                    {totalPages > 1 && <nav aria-label="MovieHub pages" className="flex justify-center items-center gap-4 mt-8">
                        <button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} className="disabled:opacity-40">Previous</button><span>{currentPage} / {totalPages}</span>
                        <button disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)} className="disabled:opacity-40">Next</button>
                    </nav>}
                </>}
            </div>
            <aside className="md:w-64 space-y-6">
                {!showsLoading && !showsError && <div className="bg-gray-900/80 rounded-xl p-4">
                    <h2 className="font-semibold mb-4">Highest rated</h2>
                    {featured.map(movie => <Link key={movie._id} to={routesConfig.movieDetailsPageGenerator(movie._id)} className="block py-2 hover:text-primary">{movie.title} · {Number(movie.vote_average || 0).toFixed(1)}</Link>)}
                </div>}
                <Link to={routesConfig.releasesPage} className="block text-primary">Browse the release calendar →</Link>
            </aside>
        </div>
    </div>;
}
