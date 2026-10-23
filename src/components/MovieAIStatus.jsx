import { Download, LoaderCircle } from 'lucide-react';
import { initializeMovieAI, useMovieAI } from '@/services/movieAI';

export default function MovieAIStatus() {
    const { status, progress, error } = useMovieAI();
    if (status === 'ready') return null;
    return <div className="movie-ai-typography rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm leading-relaxed">
        {status === 'loading' ? <div role="status">
            <p className="flex gap-2 items-center"><LoaderCircle className="w-4 h-4 shrink-0 animate-spin" />Đang chuẩn bị trợ lý… {progress}%</p>
            <div role="progressbar" aria-label="Tiến trình khởi động trợ lý" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} className="mt-3 h-1 rounded-full bg-white/10 overflow-hidden"><div style={{ width: `${progress}%` }} className="h-full bg-primary transition-[width]" /></div>
        </div> : <>
            <p className="text-gray-300">Khởi động trợ lý để tìm bộ phim hợp gu bạn.</p>
            <button onClick={() => initializeMovieAI().catch(() => {})} className="mt-3 flex items-center gap-2 text-primary font-medium"><Download className="w-4 h-4 shrink-0" />{status === 'error' ? 'Thử lại' : 'Bật AI chọn phim'}</button>
        </>}
        {error && <p role="alert" className="mt-2 text-gray-300">{error}</p>}
    </div>;
}
