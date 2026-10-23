import { Download, LoaderCircle, Sparkles } from 'lucide-react';
import { initializeMovieAI, useMovieAI } from '@/services/movieAI';

export default function MovieAIStatus() {
    const { status, progress, error } = useMovieAI();
    return <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs">
        {status === 'ready' ? <p className="flex gap-2 items-center text-primary"><Sparkles className="w-4 h-4" />AI đã sẵn sàng trên trình duyệt</p> : status === 'loading' ? <p role="status" className="flex gap-2 items-center"><LoaderCircle className="w-4 h-4 animate-spin" />Đang tải mô hình AI… {progress}%</p> : <>
            <p className="text-gray-300 leading-relaxed">AI hiểu sở thích bằng tiếng Việt và tiếng Anh. Lần đầu cần tải mô hình khoảng 120 MB, sau đó trình duyệt có thể lưu lại. Nội dung bạn nhập được xử lý trên thiết bị.</p>
            <button onClick={() => initializeMovieAI().catch(() => {})} className="mt-3 flex items-center gap-2 text-primary font-medium"><Download className="w-4 h-4" />{status === 'error' ? 'Thử tải lại AI' : 'Bật AI chọn phim'}</button>
        </>}
        {error && <p role="alert" className="mt-2 text-gray-300">{error}</p>}
    </div>;
}
