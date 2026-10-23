import { afterEach, beforeEach, expect, it, vi } from 'vitest';

let instances;
beforeEach(() => {
    vi.resetModules();
    instances = [];
    vi.stubGlobal('Worker', class {
        constructor() { this.postMessage = vi.fn(); this.terminate = vi.fn(); instances.push(this); }
    });
});
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

it('creates the worker only on activation and completes model initialization', async () => {
    const { initializeMovieAI } = await import('@/services/movieAI');
    expect(instances).toHaveLength(0);
    const result = initializeMovieAI();
    const worker = instances[0];
    expect(worker.postMessage).toHaveBeenCalledWith({ type: 'init', id: 1 });
    worker.onmessage({ data: { type: 'ready' } });
    worker.onmessage({ data: { id: 1, results: [] } });
    expect(await result).toEqual([]);
});

it('matches independent requests by ID and passes catalogue text without credentials', async () => {
    const { discoverMovies } = await import('@/services/movieAI');
    const first = discoverMovies([{ _id: 'a', title: 'Movie', overview: 'Story', genres: [] }], 'comedy');
    const second = discoverMovies([], 'action');
    const worker = instances[0];
    const payload = worker.postMessage.mock.calls[0][0];
    expect(payload.movies[0].id).toBe('a');
    expect(Object.keys(payload).sort()).toEqual(['id', 'movies', 'query', 'type']);
    worker.onmessage({ data: { id: 2, results: [] } });
    worker.onmessage({ data: { id: 1, results: [{ id: 'a', score: 0.9 }] } });
    expect(await first).toEqual([{ id: 'a', score: 0.9 }]);
    expect(await second).toEqual([]);
});

it('rejects a failed model request and allows initialization to retry', async () => {
    const { initializeMovieAI } = await import('@/services/movieAI');
    const first = initializeMovieAI();
    const rejected = expect(first).rejects.toThrow('Download failed');
    instances[0].onmessage({ data: { id: 1, error: 'Download failed', modelReady: false } });
    await rejected;
    const retry = initializeMovieAI();
    instances[0].onmessage({ data: { id: 2, results: [] } });
    expect(await retry).toEqual([]);
});

it('terminates a stuck worker and permits a fresh worker on retry', async () => {
    vi.useFakeTimers();
    const { initializeMovieAI } = await import('@/services/movieAI');
    const first = initializeMovieAI();
    const rejected = expect(first).rejects.toThrow(/quá lâu/);
    await vi.advanceTimersByTimeAsync(240001);
    await rejected;
    expect(instances[0].terminate).toHaveBeenCalledOnce();
    const retry = initializeMovieAI();
    expect(instances).toHaveLength(2);
    instances[1].onmessage({ data: { id: 2, results: [] } });
    await retry;
});
