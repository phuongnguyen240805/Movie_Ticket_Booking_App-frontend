import { SearchIcon, XIcon, LoaderCircle, ArrowUpRight } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { searchMovies } from '@/lib/movieDiscovery';
import { routesConfig } from '@/configs';
import Image from '@/components/Image';
import useDialog from '@/hooks/useDialog';

export default function Search({ setBtnShowSearch }) {
    const { shows, showsLoading, showsError, reloadShows, image_base_url } = useAppContext();
    const [query, setQuery] = useState('');
    const ref = useRef(null);
    const navigate = useNavigate();
    const close = useCallback(() => setBtnShowSearch(false), [setBtnShowSearch]);
    useDialog(ref, close);
    const results = searchMovies(shows, query);
    return <div className="fixed inset-0 z-[1000] bg-black/75 backdrop-blur-md px-4 pt-[12vh]" onClick={event => { if (event.target === event.currentTarget) close(); }}>
        <section ref={ref} role="dialog" aria-modal="true" aria-label="Search movies" className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-[#10121c] shadow-2xl overflow-hidden">
            <form onSubmit={event => { event.preventDefault(); if (results[0] && !showsLoading && !showsError) { navigate(routesConfig.movieDetailsPageGenerator(results[0]._id)); close(); } }} className="flex items-center gap-3 border-b border-white/10 p-4">
                <SearchIcon className="text-primary w-5 shrink-0" />
                <input aria-label="Search movie name or actor" placeholder="Search movie name or actor…" value={query} onChange={event => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent outline-none text-sm" />
                {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="text-xs text-gray-400">Clear</button>}
                <button type="button" onClick={close} aria-label="Close search" className="rounded-full p-1 hover:bg-white/10"><XIcon className="w-5" /></button>
            </form>
            <div className="max-h-[60dvh] overflow-y-auto p-3">
                {showsLoading ? <p role="status" className="flex gap-2 p-5 text-gray-400"><LoaderCircle className="w-4 animate-spin" />Loading movies…</p> : showsError ? <div role="alert" className="p-5"><p>{showsError}</p><button onClick={reloadShows} className="text-primary mt-3">Try again</button></div> : <>
                    <p aria-live="polite" className="px-2 pb-2 text-xs text-gray-400">{query.trim() ? `${results.length} movies found` : 'Now at our cinema'}</p>
                    {!results.length && <p className="py-8 text-center text-sm text-gray-400">No matching movies. Try another title or actor.</p>}
                    {results.slice(0, 12).map(movie => <Link key={movie._id} to={routesConfig.movieDetailsPageGenerator(movie._id)} onClick={close} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 focus-visible:outline-primary">
                        <Image src={movie.poster_path ? image_base_url + movie.poster_path : undefined} alt="" className="w-10 h-14 rounded-md object-cover shrink-0" />
                        <div className="min-w-0 flex-1"><p className="font-medium text-sm truncate">{movie.title}</p><p className="text-xs text-gray-400 mt-1">{movie.release_date?.slice(0, 4)} · {Number(movie.vote_average || 0).toFixed(1)}/10</p></div>
                        <ArrowUpRight className="w-4 text-primary" />
                    </Link>)}
                    {results.length > 12 && <p className="px-2 pt-3 text-xs text-gray-400">Showing the first 12 matches. Refine your search to see more.</p>}
                </>}
            </div>
        </section>
    </div>;
}
