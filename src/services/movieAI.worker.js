import { env, pipeline } from '@huggingface/transformers';

env.allowLocalModels = false;
env.backends.onnx.wasm.numThreads = 1;
let extractor;
let chain = Promise.resolve();
const embeddings = new Map();

async function getEmbedding(text) {
    if (embeddings.has(text)) return embeddings.get(text);
    const output = await extractor(text, { pooling: 'mean', normalize: true, truncation: true, max_length: 128 });
    const vector = Array.from(output.data);
    if (embeddings.size >= 256) embeddings.delete(embeddings.keys().next().value);
    embeddings.set(text, vector);
    return vector;
}

async function handle({ id, type, movies = [], query }) {
    try {
        if (!extractor) {
            self.postMessage({ type: 'loading' });
            extractor = await pipeline('feature-extraction', 'Xenova/paraphrase-multilingual-MiniLM-L12-v2', {
                dtype: 'q8', device: 'wasm',
                progress_callback: progress => { if (progress.status === 'progress') self.postMessage({ type: 'progress', progress: Math.round(progress.progress || 0) }); },
            });
        }
        self.postMessage({ type: 'ready' });
        if (type === 'init') { self.postMessage({ id, results: [] }); return; }
        const vector = await getEmbedding(query);
        const results = [];
        for (const movie of movies) {
            const embedding = await getEmbedding(movie.text);
            results.push({ id: movie.id, score: embedding.reduce((sum, value, index) => sum + value * vector[index], 0) });
        }
        self.postMessage({ id, results });
    } catch {
        self.postMessage({ id, error: 'Không tải hoặc chạy được mô hình AI. Kiểm tra kết nối và thử lại; tìm kiếm thông thường vẫn hoạt động.', modelReady: Boolean(extractor) });
    }
}

self.onmessage = ({ data }) => { chain = chain.then(() => handle(data)); };
