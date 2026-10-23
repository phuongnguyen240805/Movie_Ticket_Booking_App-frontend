import { SearchIcon, XIcon, CircleXIcon, LoaderCircle, ArrowUpRight } from 'lucide-react';
import classNames from 'classnames/bind';
import { useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { searchMovies } from '@/lib/movieDiscovery';
import { routesConfig } from '@/configs';
import Image from '@/components/Image';
import useDialog from '@/hooks/useDialog';
import Button from '@/components/Button';
import styles from './Search.module.scss';

const cx = classNames.bind(styles);

export default function Search({ setBtnShowSearch }) {
    const { shows, showsLoading, showsError, reloadShows, image_base_url } = useAppContext();
    const [query, setQuery] = useState('');
    const ref = useRef(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const close = useCallback(() => setBtnShowSearch(false), [setBtnShowSearch]);
    useDialog(ref, close);
    const hasQuery = Boolean(query.trim());
    const results = hasQuery ? searchMovies(shows, query) : [];
    return createPortal(<div ref={ref} role="dialog" aria-modal="true" aria-label="Search movies" className={cx('wrapper', 'fixed inset-0 z-[1000] flex justify-center bg-slate-800/50 backdrop-blur-sm px-4')} onClick={event => { if (event.target === event.currentTarget) close(); }}>
        <Button rounded onClick={close} aria-label="Close search" className="absolute top-6 right-8 h-11 w-11 flex items-center justify-center shadow-lg"><XIcon width={22} /></Button>
        <div className="relative mt-30 w-full max-w-[500px] h-fit">
            <form onSubmit={event => { event.preventDefault(); if (results[0] && !showsLoading && !showsError) { navigate(routesConfig.movieDetailsPageGenerator(results[0]._id)); close(); } }} className={cx('search', 'w-full')}>
                <input ref={inputRef} aria-label="Search movie name or actor" aria-expanded={hasQuery} aria-controls={hasQuery ? 'movie-search-results' : undefined} placeholder="Search movie name..." spellCheck={false} value={query} onChange={event => setQuery(event.target.value.trimStart())} />
                {hasQuery && !showsLoading && <button type="button" onClick={() => { setQuery(''); inputRef.current?.focus(); }} aria-label="Clear search" className={cx('clear')}><CircleXIcon width={20} /></button>}
                {hasQuery && showsLoading && <LoaderCircle className={cx('loading')} width={20} />}
                <button type="submit" aria-label="Find movies" className={cx('search-btn')}><SearchIcon /></button>
            </form>
            {hasQuery && <div id="movie-search-results" className="absolute top-full mt-3 w-full max-h-[60dvh] overflow-y-auto no-scrollbar rounded-2xl border border-white/10 bg-[#10121c]/80 backdrop-blur-xl shadow-2xl p-3">
                {showsLoading ? <p role="status" className="flex gap-2 p-5 text-gray-400"><LoaderCircle className="w-4 animate-spin" />Loading movies…</p> : showsError ? <div role="alert" className="p-5"><p>{showsError}</p><button onClick={reloadShows} className="text-primary mt-3">Try again</button></div> : <>
                    <p aria-live="polite" className="px-2 pb-2 text-xs text-gray-400">{results.length} movies found</p>
                    {!results.length && <p className="py-8 text-center text-sm text-gray-400">No matching movies. Try another title or actor.</p>}
                    {results.slice(0, 12).map(movie => <Link key={movie._id} to={routesConfig.movieDetailsPageGenerator(movie._id)} onClick={close} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 focus-visible:outline-primary">
                        <Image src={movie.poster_path ? image_base_url + movie.poster_path : undefined} alt="" className="w-10 h-14 rounded-md object-cover shrink-0" />
                        <div className="min-w-0 flex-1"><p className="font-medium text-sm truncate">{movie.title}</p><p className="text-xs text-gray-400 mt-1">{movie.release_date?.slice(0, 4)} · {Number(movie.vote_average || 0).toFixed(1)}/10</p></div>
                        <ArrowUpRight className="w-4 text-primary" />
                    </Link>)}
                    {results.length > 12 && <p className="px-2 pt-3 text-xs text-gray-400">Showing the first 12 matches. Refine your search to see more.</p>}
                </>}
            </div>}
        </div>
    </div>, document.body);
}
