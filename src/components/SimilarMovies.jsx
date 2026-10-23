import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, LoaderCircle } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { discoverMovies, useMovieAI } from '@/services/movieAI';
import { movieText, rankSemanticResults, similarByGenre } from '@/lib/movieDiscovery';
import { genreNames } from '@/lib/movieCatalog';
import { routesConfig } from '@/configs';
import MovieAIStatus from '@/components/MovieAIStatus';
import Image from '@/components/Image';

export default function SimilarMovies({ movie }) {
    const { shows, image_base_url } = useAppContext();
    const { status } = useMovieAI();
    const [recommendation, setRecommendation] = useState(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const run = useRef(0);
    useEffect(() => { run.current += 1; setRecommendation(null); setBusy(false); setError(''); return () => { run.current += 1; }; }, [movie._id, shows]);
    const aiResults = recommendation?.id === movie._id ? recommendation.items : null;
    const items = aiResults || similarByGenre(shows, movie);
    const analyze = async () => {
        const current = ++run.current;
        setBusy(true); setError('');
        try {
            const results = await discoverMovies(shows, movieText(movie));
            if (run.current === current) setRecommendation({ id: movie._id, items: rankSemanticResults(shows, results, { sourceId: movie._id }) });
        } catch (error) { if (run.current === current) setError(error.message); }
        finally { if (run.current === current) setBusy(false); }
    };
    return <section aria-label="Similar movies" className="mt-6 border-t border-white/10 pt-5">
        <div className="flex flex-wrap gap-3 items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" />Phim tương tự</h3>
            <button disabled={busy || status !== 'ready' || shows.length < 2} onClick={analyze} className="text-xs text-primary disabled:opacity-40 flex items-center gap-2">{busy && <LoaderCircle className="w-3 h-3 animate-spin" />}{busy ? 'Đang phân tích…' : 'Gợi ý bằng AI'}</button>
        </div>
        <p className="text-xs text-gray-400 mb-3">{aiResults ? 'AI so sánh nội dung phim trong danh sách của rạp.' : 'Gợi ý theo thể loại. Bật AI để so sánh sâu hơn về nội dung.'}</p>
        {status !== 'ready' && <div className="mb-3"><MovieAIStatus /></div>}
        {error && <p role="alert" className="text-xs text-gray-400 mb-3">{error}</p>}
        <div className="grid sm:grid-cols-2 gap-3">{items.map(({ movie: item }) => <Link key={item._id} to={routesConfig.movieDetailsPageGenerator(item._id)} className="flex items-center gap-3 rounded-xl bg-white/5 p-2 hover:bg-white/10">
            <Image src={item.poster_path ? image_base_url + item.poster_path : undefined} alt="" className="h-16 w-11 rounded-md object-cover shrink-0" />
            <div className="min-w-0"><p className="text-sm font-medium truncate">{item.title}</p><p className="text-xs text-gray-400 line-clamp-1 mt-1">{genreNames(item).join(' · ')}</p><p className="text-xs text-primary mt-1">{Number(item.vote_average || 0).toFixed(1)}/10 · Xem phim & đặt vé →</p></div>
        </Link>)}</div>
        {!items.length && <p className="text-xs text-gray-400">Chưa có phim tương tự trong lịch chiếu hiện tại.</p>}
    </section>;
}
