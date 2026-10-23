import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchShow } from '@/services/showService';
import { useAppContext } from '@/context/AppContext';
import { routesConfig } from '@/configs';
import Image from '@/components/Image';
import timeFormat from '@/lib/timeFormat';
import SimilarMovies from '@/components/SimilarMovies';

export default function MovieHubDetails({ movie }) {
    const { image_base_url } = useAppContext();
    const [details, setDetails] = useState(null);
    const [error, setError] = useState('');
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let active = true;
        setError('');
        setDetails(null);
        const load = async () => {
            try {
                const data = await fetchShow(movie._id);
                if (!data?.success || !data.movie) throw new Error(data?.message || 'Unable to load movie information');
                if (active) setDetails(data);
            } catch (error) {
                if (active) setError(error.message);
            }
        };
        load();
        return () => { active = false; };
    }, [movie._id, attempt]);

    const film = details?.movie || movie;
    const screenings = Object.entries(details?.dateTime || {}).filter(([, times]) => Array.isArray(times) && times.length).sort(([a], [b]) => a.localeCompare(b));
    return <section aria-label={`${movie.title} overview`} className="border border-primary/20 bg-gray-900/50 rounded-xl p-4 sm:p-5 mt-3 space-y-5">
        <div className="grid sm:grid-cols-[1fr_auto] gap-4">
            <div>
                <h4 className="font-semibold mb-2">About the movie</h4>
                <p className="text-sm leading-relaxed text-gray-300">{film.overview || 'Synopsis unavailable.'}</p>
                <p className="text-xs text-gray-400 mt-3">{[film.runtime ? timeFormat(film.runtime) : '', film.original_language?.toUpperCase(), film.release_date].filter(Boolean).join(' · ')}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 sm:w-36 self-start">
                <p className="text-xs text-gray-400">Audience rating</p>
                <p className="text-2xl font-semibold text-primary mt-1">{Number(film.vote_average || 0).toFixed(1)}<span className="text-sm text-gray-400"> / 10</span></p>
            </div>
        </div>
        <div>
            <h4 className="font-semibold mb-3">Cast</h4>
            {(film.casts || []).length ? <div className="flex gap-4 overflow-x-auto pb-2">
                {film.casts.slice(0, 8).map((cast, index) => <div key={cast.id || index} className="flex gap-2 min-w-40 max-w-48 items-center">
                    <Image src={cast.profile_path ? image_base_url + cast.profile_path : undefined} alt={cast.name} className="h-12 w-10 shrink-0 rounded-md object-cover" loading="lazy" />
                    <div className="text-xs min-w-0"><p className="font-medium">{cast.name}</p><p className="text-gray-400 line-clamp-2">{cast.character}</p></div>
                </div>)}
            </div> : <p className="text-sm text-gray-400">Cast information unavailable.</p>}
        </div>
        <div className="border-t border-white/10 pt-4">
            <h4 className="font-semibold">Screenings <span className="text-xs font-normal text-gray-400">· Vietnam time (UTC+7)</span></h4>
            {error ? <div role="alert" className="text-sm mt-3"><p>{error}</p><button onClick={() => setAttempt(value => value + 1)} className="text-primary mt-2">Retry screenings</button></div> : !details ? <p role="status" className="text-sm text-gray-400 mt-3">Loading screenings…</p> : screenings.length ?
                <div className="space-y-3 mt-3 max-h-64 overflow-y-auto">
                    {screenings.map(([date, times]) => <div key={date} className="flex flex-wrap items-center gap-3 bg-white/5 rounded-lg p-3">
                        <p className="text-sm font-medium min-w-28">{new Date(times[0].time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' })}</p>
                        <div className="flex flex-wrap gap-2 flex-1">{times.map((show, index) => <span key={show.showId || index} className="text-xs text-gray-300 border border-white/10 rounded px-2 py-1">{new Date(show.time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' })}</span>)}</div>
                        <Link to={routesConfig.seatLayoutPageGenerator(movie._id, date)} className="bg-primary rounded-md px-3 py-2 text-xs font-medium" aria-label={`Book tickets for ${movie.title} on ${date}`}>Book tickets →</Link>
                    </div>)}
                </div> : <p className="text-sm text-gray-400 mt-3">No screenings currently available.</p>}
        </div>
        <SimilarMovies movie={film} />
    </section>;
}
