import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, XIcon, Send, LoaderCircle, RotateCcw } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { discoverMovies, useMovieAI } from '@/services/movieAI';
import { movieText, rankSemanticResults } from '@/lib/movieDiscovery';
import { genreNames } from '@/lib/movieCatalog';
import { routesConfig } from '@/configs';
import useDialog from '@/hooks/useDialog';
import MovieAIStatus from '@/components/MovieAIStatus';
import AssistantScreenings from '@/components/AssistantScreenings';
import Image from '@/components/Image';

const QUICK_PROMPTS = ['Phim hài để xem cùng bạn bè', 'Hành động, không kinh dị', 'Phim dưới 120 phút', 'Phim hoạt hình cho gia đình'];
const GENRE_PROMPTS = [
    { label: 'Hài hước', query: 'Gợi ý phim hài hước' },
    { label: 'Hành động', query: 'Gợi ý phim hành động' },
    { label: 'Lãng mạn', query: 'Gợi ý phim lãng mạn' },
    { label: 'Hoạt hình', query: 'Gợi ý phim hoạt hình' },
];

function AssistantPanel({ onClose }) {
    const { shows, showsLoading, showsError, reloadShows, image_base_url, favoriteMovies } = useAppContext();
    const { status } = useMovieAI();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [selected, setSelected] = useState(null);
    const [showGenres, setShowGenres] = useState(false);
    const ref = useRef(null);
    const latest = useRef(null);
    const thinking = useRef(null);
    const selectedCard = useRef(null);
    const pendingReveal = useRef(null);
    const preferences = useRef([]);
    const run = useRef(0);
    const stopThinking = useCallback(() => {
        if (!pendingReveal.current) return;
        clearTimeout(pendingReveal.current.timer);
        pendingReveal.current.resolve();
        pendingReveal.current = null;
    }, []);
    useDialog(ref, onClose);
    useEffect(() => () => { run.current += 1; stopThinking(); }, [stopThinking]);
    useEffect(() => { latest.current?.scrollIntoView?.({ block: 'start' }); }, [messages]);
    useEffect(() => { if (busy) thinking.current?.scrollIntoView?.({ block: 'nearest' }); }, [busy]);
    useEffect(() => { selectedCard.current?.scrollIntoView?.({ block: 'nearest' }); }, [selected]);
    const ask = async (text, { personalized = false, fresh = false, excludeIds = [], maxRuntime = null } = {}) => {
        const value = text.trim().slice(0, 500);
        if (!value || busy || status !== 'ready' || showsLoading || showsError || !shows.length) return;
        const current = ++run.current;
        const previous = fresh || personalized ? [] : preferences.current;
        const query = personalized ? `${value}. ${favoriteMovies.slice(0, 3).map(movieText).join(' ')}` : [...previous, value].join('. ');
        preferences.current = [...previous, value].slice(-2);
        const candidates = shows.filter(movie => !excludeIds.includes(movie._id) && (!maxRuntime || (movie.runtime > 0 && movie.runtime < maxRuntime)));
        setInput(''); setError(''); setBusy(true); setSelected(null); setShowGenres(false);
        setMessages(items => [...items, { role: 'user', text: value }].slice(-12));
        // Let fast responses keep the same brief thinking animation as uncached ones.
        const reveal = new Promise(resolve => {
            pendingReveal.current = { resolve, timer: setTimeout(() => { pendingReveal.current = null; resolve(); }, 1500) };
        });
        try {
            const [results] = await Promise.all([discoverMovies(candidates, query), reveal]);
            const items = rankSemanticResults(candidates, results, { query });
            if (run.current === current) setMessages(previous => [...previous, {
                role: 'assistant', items, text: items.length ? 'Mình tìm được các phim phù hợp dưới đây trong danh sách của rạp. Bạn có thể xem lịch chiếu và chọn ngày đặt vé.' : 'Chưa có phim phù hợp với yêu cầu trong danh sách hiện tại. Bạn thử đổi thể loại hoặc bỏ bớt điều kiện nhé.',
            }].slice(-12));
        } catch (error) { if (run.current === current) setError(error.message); }
        finally { if (run.current === current) { stopThinking(); setBusy(false); } }
    };
    const available = status === 'ready' && !busy && !showsLoading && !showsError && shows.length > 0;
    const lastReplyIndex = messages.findLastIndex(message => message.role === 'assistant');
    const lastReply = messages[lastReplyIndex];
    const seenIds = messages.flatMap(message => message.items || []).map(({ movie }) => movie._id);
    const runtimes = (lastReply?.items || []).map(({ movie }) => movie.runtime).filter(runtime => runtime > 0);
    const shorterThan = runtimes.length ? Math.min(...runtimes) : null;
    const canShorten = shorterThan && shows.some(movie => movie.runtime > 0 && movie.runtime < shorterThan);
    return <section ref={ref} role="dialog" aria-modal="true" aria-label="Trợ lý chọn phim" className="movie-ai-typography fixed z-[90] bottom-56 right-3 sm:right-10 w-[calc(100vw-24px)] sm:w-[420px] max-h-[calc(100dvh-244px)] h-[620px] flex flex-col overflow-hidden rounded-2xl bg-[#10121c]/85 backdrop-blur-xl border border-white/10 shadow-2xl">
        <header className="flex items-center gap-3 p-4 border-b border-white/10 bg-primary/5">
            <span className="rounded-xl p-2 bg-primary/15 text-primary"><Sparkles className="w-5 h-5" /></span>
            <h2 className="flex-1 font-semibold text-sm leading-relaxed">Trợ lý chọn phim</h2>
            <button aria-label="Bắt đầu lại" onClick={() => { run.current += 1; stopThinking(); preferences.current = []; setMessages([]); setError(''); setBusy(false); setSelected(null); setShowGenres(false); }} className="p-1.5 hover:bg-white/5 rounded-full"><RotateCcw className="w-4" /></button>
            <button aria-label="Đóng trợ lý" onClick={onClose} className="p-1.5 hover:bg-white/5 rounded-full"><XIcon className="w-5" /></button>
        </header>
        <div className="p-4 overflow-y-auto flex-1 min-h-0 space-y-4">
            {!messages.length && <p className="text-sm text-gray-300 leading-relaxed">Hôm nay bạn muốn xem gì? Kể mình nghe thể loại hoặc tâm trạng của bạn nhé.</p>}
            <MovieAIStatus />
            {showsLoading && <p role="status" className="text-xs text-gray-400">Đang tải danh sách phim…</p>}
            {showsError && <div role="alert" className="text-xs"><p>{showsError}</p><button onClick={reloadShows} className="text-primary mt-2">Tải lại phim</button></div>}
            {!showsLoading && !showsError && !shows.length && <p className="text-xs text-gray-400">Rạp chưa có phim trong lịch chiếu.</p>}
            {!messages.length && <div className="flex flex-wrap gap-2">{QUICK_PROMPTS.map(prompt => <button key={prompt} disabled={!available} onClick={() => ask(prompt)} className="text-xs rounded-full px-3 py-2 border border-white/10 text-gray-300 hover:border-primary/50 disabled:opacity-40">{prompt}</button>)}
                {favoriteMovies?.length > 0 && <button disabled={!available} onClick={() => ask('Gợi ý phim giống những phim tôi yêu thích', { personalized: true })} className="text-xs text-primary rounded-full px-3 py-2 border border-primary/30 disabled:opacity-40">Dựa trên phim yêu thích</button>}
            </div>}
            <div role="log" aria-label="Hội thoại chọn phim" aria-live="polite" className="space-y-4">{messages.map((message, index) => <div key={index} ref={index === messages.length - 1 ? latest : undefined} className={message.role === 'user' ? 'ml-8 rounded-2xl rounded-tr-sm bg-primary/15 border border-primary/20 p-3' : 'space-y-3'}>
                <p className="text-sm leading-relaxed">{message.text}</p>
                {message.items?.map(({ movie }) => <div key={movie._id} ref={selected === `${index}:${movie._id}` ? selectedCard : undefined} className="rounded-xl p-3 bg-white/5 border border-white/5">
                    <div className="flex gap-3"><Image src={movie.poster_path ? image_base_url + movie.poster_path : undefined} alt="" className="w-12 h-16 rounded-md object-cover shrink-0" />
                        <div className="min-w-0"><Link to={routesConfig.movieDetailsPageGenerator(movie._id)} onClick={onClose} className="font-medium text-sm hover:text-primary">{movie.title}</Link><p className="text-[11px] text-gray-400 mt-1">{genreNames(movie).join(' · ')}</p><p className="text-xs text-primary mt-1">{Number(movie.vote_average || 0).toFixed(1)}/10{movie.runtime ? ` · ${movie.runtime} phút` : ''}</p></div>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2 mt-2">{movie.overview}</p>
                    <button onClick={() => setSelected(value => value === `${index}:${movie._id}` ? null : `${index}:${movie._id}`)} aria-expanded={selected === `${index}:${movie._id}`} className="text-xs text-primary mt-2">Lịch chiếu & đặt vé →</button>
                    {selected === `${index}:${movie._id}` && <AssistantScreenings movieId={movie._id} onNavigate={onClose} />}
                </div>)}
            </div>)}</div>
            {busy && <div ref={thinking} role="status" className="flex gap-3 items-center rounded-2xl rounded-tl-sm bg-white/5 border border-white/5 p-3 text-sm text-gray-300">
                <LoaderCircle className="w-5 h-5 shrink-0 animate-spin text-primary" />
                <span>Mình đang chọn phim cho bạn…</span>
                <span aria-hidden="true" className="flex gap-1 ml-auto">{[0, 1, 2].map(index => <span key={index} className="h-1 w-1 rounded-full bg-primary animate-pulse" style={{ animationDelay: `${index * 200}ms` }} />)}</span>
            </div>}
            {!busy && lastReply && messages.at(-1)?.role === 'assistant' && <section aria-label="Gợi ý tiếp theo" className="space-y-2 pt-2">
                <p className="text-xs text-gray-400">Bạn muốn mình giúp gì tiếp?</p>
                <div className="flex flex-wrap gap-2">
                    {shows.some(movie => !seenIds.includes(movie._id)) && <button disabled={!available} onClick={() => ask('Gợi ý cho mình vài phim khác', { excludeIds: seenIds })} className="rounded-full border border-primary/30 text-primary px-3 py-2 text-xs hover:bg-primary/10 disabled:opacity-40">Gợi ý phim khác</button>}
                    {canShorten && <button disabled={!available} onClick={() => ask(`Tìm phim ngắn hơn, dưới ${shorterThan} phút`, { maxRuntime: shorterThan })} className="rounded-full border border-white/10 px-3 py-2 text-xs hover:border-primary/50 disabled:opacity-40">Phim ngắn hơn</button>}
                    <button disabled={!available} onClick={() => ask('Mình không muốn xem phim kinh dị')} className="rounded-full border border-white/10 px-3 py-2 text-xs hover:border-primary/50 disabled:opacity-40">Không kinh dị</button>
                    <button disabled={!available} onClick={() => setShowGenres(value => !value)} aria-expanded={showGenres} className="rounded-full border border-white/10 px-3 py-2 text-xs hover:border-primary/50 disabled:opacity-40">Đổi thể loại</button>
                    {lastReply.items?.[0] && <button disabled={!available} onClick={() => setSelected(`${lastReplyIndex}:${lastReply.items[0].movie._id}`)} className="rounded-full border border-white/10 px-3 py-2 text-xs hover:border-primary/50 disabled:opacity-40">Xem lịch chiếu</button>}
                </div>
                {showGenres && <div className="flex flex-wrap gap-2 rounded-xl bg-white/5 p-3">{GENRE_PROMPTS.map(prompt => <button key={prompt.label} disabled={!available} onClick={() => ask(prompt.query, { fresh: true })} className="text-xs rounded-full bg-primary/10 border border-primary/20 px-3 py-2 text-primary hover:bg-primary/20 disabled:opacity-40">{prompt.label}</button>)}</div>}
            </section>}
            {error && <p role="alert" className="text-xs text-gray-300">{error} Bạn có thể nhập lại yêu cầu để thử lần nữa.</p>}
        </div>
        <form onSubmit={event => { event.preventDefault(); ask(input); }} className="p-3 border-t border-white/10 flex gap-2">
            <input aria-label="Sở thích xem phim" maxLength={500} value={input} onChange={event => setInput(event.target.value)} placeholder={status === 'ready' ? 'Mô tả phim bạn muốn xem…' : 'Bật AI để bắt đầu…'} className="min-w-0 flex-1 bg-white/5 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary/50" />
            <button aria-label="Gửi yêu cầu" disabled={!available || !input.trim()} className="p-3 rounded-full bg-primary disabled:opacity-40"><Send className="w-4 h-4" /></button>
        </form>
    </section>;
}

export default function MovieAssistant() {
    const [open, setOpen] = useState(false);
    const close = useCallback(() => setOpen(false), []);
    return <>
        <button aria-label={open ? 'Đóng trợ lý chọn phim' : 'Mở trợ lý chọn phim'} title="AI chọn phim" aria-expanded={open} onClick={() => setOpen(value => !value)} className="group fixed z-[80] bottom-38 right-10 w-14 h-14 flex items-center justify-center bg-primary rounded-full shadow-lg hover:bg-primary-dull transition-colors">
            <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
        {open && <AssistantPanel onClose={close} />}
    </>;
}
