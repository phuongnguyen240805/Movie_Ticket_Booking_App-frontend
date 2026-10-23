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

function AssistantPanel({ onClose }) {
    const { shows, showsLoading, showsError, reloadShows, image_base_url, favoriteMovies } = useAppContext();
    const { status } = useMovieAI();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [selected, setSelected] = useState(null);
    const ref = useRef(null);
    const latest = useRef(null);
    const run = useRef(0);
    useDialog(ref, onClose);
    useEffect(() => () => { run.current += 1; }, []);
    useEffect(() => { latest.current?.scrollIntoView?.({ block: 'start' }); }, [messages]);
    const ask = async (text, personalized = false) => {
        const value = text.trim().slice(0, 500);
        if (!value || busy || status !== 'ready' || showsLoading || showsError || !shows.length) return;
        const current = ++run.current;
        const previous = messages.filter(message => message.role === 'user').slice(-2).map(message => message.text);
        const query = personalized ? `${value}. ${favoriteMovies.slice(0, 3).map(movieText).join(' ')}` : [...previous, value].join('. ');
        setInput(''); setError(''); setBusy(true); setSelected(null);
        setMessages(items => [...items, { role: 'user', text: value }].slice(-12));
        try {
            const results = await discoverMovies(shows, query);
            const items = rankSemanticResults(shows, results, { query });
            if (run.current === current) setMessages(previous => [...previous, {
                role: 'assistant', items, text: items.length ? 'Mình tìm được các phim phù hợp dưới đây trong danh sách của rạp. Bạn có thể xem lịch chiếu và chọn ngày đặt vé.' : 'Chưa có phim phù hợp với yêu cầu trong danh sách hiện tại. Bạn thử đổi thể loại hoặc bỏ bớt điều kiện nhé.',
            }].slice(-12));
        } catch (error) { if (run.current === current) setError(error.message); }
        finally { if (run.current === current) setBusy(false); }
    };
    const available = status === 'ready' && !busy && !showsLoading && !showsError && shows.length > 0;
    return <section ref={ref} role="dialog" aria-modal="true" aria-label="Trợ lý chọn phim" className="fixed z-[90] bottom-56 right-3 sm:right-10 w-[calc(100vw-24px)] sm:w-[420px] max-h-[calc(100dvh-244px)] h-[620px] flex flex-col overflow-hidden rounded-2xl bg-[#10121c] border border-white/10 shadow-2xl">
        <header className="flex items-center gap-3 p-4 border-b border-white/10 bg-primary/5">
            <span className="rounded-xl p-2 bg-primary/15 text-primary"><Sparkles className="w-5 h-5" /></span>
            <div className="flex-1"><h2 className="font-semibold text-sm">Trợ lý chọn phim</h2><p className="text-[11px] text-gray-400">AI ngữ nghĩa · Dữ liệu phim từ rạp</p></div>
            <button aria-label="Bắt đầu lại" onClick={() => { run.current += 1; setMessages([]); setError(''); setBusy(false); setSelected(null); }} className="p-1.5 hover:bg-white/5 rounded-full"><RotateCcw className="w-4" /></button>
            <button aria-label="Đóng trợ lý" onClick={onClose} className="p-1.5 hover:bg-white/5 rounded-full"><XIcon className="w-5" /></button>
        </header>
        <div className="p-4 overflow-y-auto flex-1 min-h-0 space-y-4">
            <p className="text-sm text-gray-300 leading-relaxed">Bạn muốn xem gì hôm nay? Mình giúp tìm phim theo sở thích, nội dung và diễn viên. Lịch chiếu luôn lấy từ rạp; giá vé được xác nhận khi đặt vé.</p>
            <MovieAIStatus />
            {showsLoading && <p role="status" className="text-xs text-gray-400">Đang tải danh sách phim…</p>}
            {showsError && <div role="alert" className="text-xs"><p>{showsError}</p><button onClick={reloadShows} className="text-primary mt-2">Tải lại phim</button></div>}
            {!showsLoading && !showsError && !shows.length && <p className="text-xs text-gray-400">Rạp chưa có phim trong lịch chiếu.</p>}
            {!messages.length && <div className="flex flex-wrap gap-2">{['Phim hài để xem cùng bạn bè', 'Hành động, không kinh dị', 'Phim dưới 120 phút'].map(prompt => <button key={prompt} disabled={!available} onClick={() => ask(prompt)} className="text-xs rounded-full px-3 py-2 border border-white/10 text-gray-300 hover:border-primary/50 disabled:opacity-40">{prompt}</button>)}
                {favoriteMovies?.length > 0 && <button disabled={!available} onClick={() => ask('Gợi ý phim giống những phim tôi yêu thích', true)} className="text-xs text-primary rounded-full px-3 py-2 border border-primary/30 disabled:opacity-40">Dựa trên phim yêu thích</button>}
            </div>}
            <div role="log" aria-label="Hội thoại chọn phim" aria-live="polite" className="space-y-4">{messages.map((message, index) => <div key={index} ref={index === messages.length - 1 ? latest : undefined} className={message.role === 'user' ? 'ml-8 rounded-2xl rounded-tr-sm bg-primary/15 border border-primary/20 p-3' : 'space-y-3'}>
                <p className="text-sm leading-relaxed">{message.text}</p>
                {message.items?.map(({ movie }) => <div key={movie._id} className="rounded-xl p-3 bg-white/5 border border-white/5">
                    <div className="flex gap-3"><Image src={movie.poster_path ? image_base_url + movie.poster_path : undefined} alt="" className="w-12 h-16 rounded-md object-cover shrink-0" />
                        <div className="min-w-0"><Link to={routesConfig.movieDetailsPageGenerator(movie._id)} onClick={onClose} className="font-medium text-sm hover:text-primary">{movie.title}</Link><p className="text-[11px] text-gray-400 mt-1">{genreNames(movie).join(' · ')}</p><p className="text-xs text-primary mt-1">{Number(movie.vote_average || 0).toFixed(1)}/10{movie.runtime ? ` · ${movie.runtime} phút` : ''}</p></div>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2 mt-2">{movie.overview}</p>
                    <button onClick={() => setSelected(value => value === `${index}:${movie._id}` ? null : `${index}:${movie._id}`)} aria-expanded={selected === `${index}:${movie._id}`} className="text-xs text-primary mt-2">Lịch chiếu & đặt vé →</button>
                    {selected === `${index}:${movie._id}` && <AssistantScreenings movieId={movie._id} onNavigate={onClose} />}
                </div>)}
            </div>)}</div>
            {busy && <p role="status" className="flex gap-2 text-xs text-gray-400"><LoaderCircle className="w-4 animate-spin" />AI đang so sánh nội dung phim…</p>}
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
