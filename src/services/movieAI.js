import { useSyncExternalStore } from 'react';
import { movieText } from '@/lib/movieDiscovery';

let worker;
let sequence = 0;
let state = { status: 'idle', progress: 0, error: '' };
const listeners = new Set();
const pending = new Map();
const snapshot = () => state;
const subscribe = listener => { listeners.add(listener); return () => listeners.delete(listener); };
function publish(update) { state = { ...state, ...update }; listeners.forEach(listener => listener()); }
function failWorker(message) {
    worker?.terminate();
    worker = undefined;
    publish({ status: 'error', error: message });
    pending.forEach(({ reject, timer }) => { clearTimeout(timer); reject(new Error(message)); });
    pending.clear();
}
function getWorker() {
    if (worker) return worker;
    worker = new Worker(new URL('./movieAI.worker.js', import.meta.url), { type: 'module' });
    worker.onmessage = ({ data }) => {
        if (data.type === 'loading') publish({ status: 'loading', error: '' });
        if (data.type === 'progress') publish({ progress: data.progress });
        if (data.type === 'ready') publish({ status: 'ready', error: '', progress: 100 });
        const request = pending.get(data.id);
        if (!request) return;
        clearTimeout(request.timer);
        pending.delete(data.id);
        if (data.error) {
            publish({ status: data.modelReady ? 'ready' : 'error', error: data.error });
            request.reject(new Error(data.error));
        } else request.resolve(data.results);
    };
    worker.onerror = () => failWorker('Trình duyệt không chạy được AI. Bạn vẫn có thể tìm phim và đặt vé bình thường.');
    return worker;
}
function request(payload) {
    return new Promise((resolve, reject) => {
        try {
            const instance = getWorker();
            const id = ++sequence;
            const timer = setTimeout(() => failWorker('AI phản hồi quá lâu. Hãy thử lại khi kết nối ổn định hơn.'), 240000);
            pending.set(id, { resolve, reject, timer });
            instance.postMessage({ ...payload, id });
        } catch {
            const message = 'Trình duyệt chưa hỗ trợ AI này. Tìm kiếm thông thường vẫn hoạt động.';
            publish({ status: 'error', error: message });
            reject(new Error(message));
        }
    });
}

export const useMovieAI = () => useSyncExternalStore(subscribe, snapshot);
export const initializeMovieAI = () => {
    publish({ status: 'loading', progress: 0, error: '' });
    return request({ type: 'init' });
};
export const discoverMovies = (movies, query) => request({ type: 'rank', query, movies: movies.map(movie => ({ id: movie._id, text: movieText(movie) })) });
