import { beforeEach, expect, it, vi } from 'vitest';
import axios from 'axios';
import { fetchShows } from '@/services/showService';
vi.mock('axios', () => ({ default: { get: vi.fn() } }));
let callbacks;
beforeEach(() => { callbacks = { setShows: vi.fn(), setShowsLoading: vi.fn(), setShowsError: vi.fn() }; });

it('uses the public route and deduplicates movies returned for multiple shows', async () => {
    axios.get.mockResolvedValue({ data: { success: true, shows: [{ _id: '1' }, { _id: '1' }, null, { _id: '2' }] } });
    await fetchShows(callbacks);
    expect(axios.get).toHaveBeenCalledWith('/api/show/all');
    expect(callbacks.setShows).toHaveBeenCalledWith([{ _id: '1' }, { _id: '2' }]);
    expect(callbacks.setShowsLoading.mock.calls).toEqual([[true], [false]]);
});
it.each([{ success: false, message: 'Database offline' }, { success: true }])('handles invalid or failed responses: %s', async data => {
    axios.get.mockResolvedValue({ data });
    await fetchShows(callbacks);
    expect(callbacks.setShows).not.toHaveBeenCalled();
    expect(callbacks.setShowsError).toHaveBeenLastCalledWith(data.message || 'Unable to load movies. Please try again.');
    expect(callbacks.setShowsLoading).toHaveBeenLastCalledWith(false);
});
it('ends loading and exposes network failures', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));
    await fetchShows(callbacks);
    expect(callbacks.setShowsError).toHaveBeenLastCalledWith('Network Error');
    expect(callbacks.setShowsLoading).toHaveBeenLastCalledWith(false);
});
