import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import Search from '@/components/Search/Search';
import MovieAssistant from '@/components/MovieAssistant';
import SimilarMovies from '@/components/SimilarMovies';
import { queryConstraints, rankSemanticResults, searchMovies, similarByGenre } from '@/lib/movieDiscovery';

const mocks = vi.hoisted(() => ({ context: {}, ai: { status: 'ready', error: '', progress: 100 }, discover: vi.fn(), initialize: vi.fn(), fetchShow: vi.fn() }));
vi.mock('@/context/AppContext', () => ({ useAppContext: () => mocks.context }));
vi.mock('@/services/movieAI', () => ({ useMovieAI: () => mocks.ai, discoverMovies: mocks.discover, initializeMovieAI: mocks.initialize }));
vi.mock('@/services/showService', () => ({ fetchShow: mocks.fetchShow }));
const movie = { _id: '1', title: 'Sky Warriors', overview: 'An adventure in space.', genres: [{ name: 'Action' }], casts: [{ name: 'Nguyễn An' }], runtime: 100, vote_average: 8 };
const comedy = { ...movie, _id: '2', title: 'Funny Friends', genres: [{ name: 'Comedy' }], casts: [], runtime: 90 };
const horror = { ...movie, _id: '3', title: 'Dark Planet', genres: [{ name: 'Action' }, { name: 'Horror' }], runtime: 130 };
function Location() { return <p data-testid="location">{useLocation().pathname}</p>; }
const mount = element => render(<MemoryRouter>{element}<Location /></MemoryRouter>);
afterEach(cleanup);
beforeEach(() => {
    mocks.ai = { status: 'ready', error: '', progress: 100 };
    mocks.context = { shows: [movie, comedy, horror], showsLoading: false, showsError: '', reloadShows: vi.fn(), image_base_url: '', favoriteMovies: [] };
    mocks.discover.mockReset(); mocks.fetchShow.mockReset(); mocks.initialize.mockReset();
});

describe('backend catalogue search', () => {
    it('searches movie titles and Vietnamese actor names without accents', () => {
        expect(searchMovies([movie, comedy], 'nguyen an')).toEqual([movie]);
        expect(searchMovies([{ ...movie, overview: 'long '.repeat(400), casts: [...Array.from({ length: 8 }, () => ({ name: 'Other' })), { name: 'Nguyễn An' }] }], 'nguyen an')).toHaveLength(1);
        const close = vi.fn();
        mount(<Search setBtnShowSearch={close} />);
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'sky' } });
        expect(screen.getByText('1 movies found')).toBeTruthy();
        expect(screen.queryByText('Funny Friends')).toBeNull();
        fireEvent.click(screen.getByRole('link', { name: /Sky Warriors/ }));
        expect(screen.getByTestId('location').textContent).toBe('/movie/1');
        expect(close).toHaveBeenCalledWith(false);
    });
    it('handles loading, backend failure, retry and no results', () => {
        mocks.context.showsLoading = true;
        const view = mount(<Search setBtnShowSearch={vi.fn()} />);
        expect(screen.getByRole('status')).toBeTruthy();
        mocks.context.showsLoading = false; mocks.context.showsError = 'Offline';
        view.rerender(<MemoryRouter><Search setBtnShowSearch={vi.fn()} /></MemoryRouter>);
        fireEvent.click(screen.getByText('Try again'));
        expect(mocks.context.reloadShows).toHaveBeenCalledOnce();
        mocks.context.showsError = '';
        view.rerender(<MemoryRouter><Search setBtnShowSearch={vi.fn()} /></MemoryRouter>);
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'missing film' } });
        expect(screen.getByText(/No matching movies/)).toBeTruthy();
    });
    it('supports Enter navigation, clearing and Escape close', () => {
        const close = vi.fn();
        mount(<Search setBtnShowSearch={close} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'sky' } });
        fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));
        expect(input.value).toBe('');
        fireEvent.change(input, { target: { value: 'sky' } });
        fireEvent.submit(input.closest('form'));
        expect(screen.getByTestId('location').textContent).toBe('/movie/1');
        fireEvent.keyDown(input, { key: 'Escape' });
        expect(close).toHaveBeenCalledWith(false);
    });
});

describe('AI recommendations and cinema assistant', () => {
    it('respects explicit Vietnamese negative genre and duration constraints', () => {
        expect(queryConstraints('Hành động, không kinh dị, dưới 120 phút')).toEqual({ excluded: ['Horror'], preferred: ['Action'], maxRuntime: 120 });
        const results = [{ id: '1', score: 0.4 }, { id: '3', score: 0.9 }];
        expect(rankSemanticResults([movie, horror], results, { query: 'Hành động, không kinh dị' }).map(item => item.movie._id)).toEqual(['1']);
        expect(rankSemanticResults([movie, horror], results, { sourceId: '1' }).map(item => item.movie._id)).toEqual(['3']);
        expect(similarByGenre([movie, comedy, horror], movie).map(item => item.movie._id)).toEqual(['3']);
    });
    it('replaces genre suggestions with semantic results, excluding the source film', async () => {
        mocks.discover.mockResolvedValue([{ id: '1', score: 1 }, { id: '2', score: 0.8 }, { id: '3', score: 0.3 }]);
        mount(<SimilarMovies movie={movie} />);
        fireEvent.click(screen.getByRole('button', { name: 'Gợi ý bằng AI' }));
        await screen.findByText(/AI so sánh nội dung/);
        expect(screen.getByText('Funny Friends')).toBeTruthy();
        expect(screen.queryByText('Sky Warriors')).toBeNull();
    });
    it('does not download or invoke AI before explicit activation', () => {
        mocks.ai.status = 'idle';
        mount(<MovieAssistant />);
        fireEvent.click(screen.getByRole('button', { name: 'Mở trợ lý chọn phim' }));
        expect(mocks.discover).not.toHaveBeenCalled();
        expect(mocks.initialize).not.toHaveBeenCalled();
        expect(screen.getByRole('button', { name: 'Gửi yêu cầu' }).disabled).toBe(true);
        mocks.initialize.mockResolvedValue([]);
        fireEvent.click(screen.getByRole('button', { name: 'Bật AI chọn phim' }));
        expect(mocks.initialize).toHaveBeenCalledOnce();
    });
    it('answers with real catalogue movies and loads actual screenings for booking', async () => {
        mocks.discover.mockResolvedValue([{ id: '1', score: 0.9 }, { id: '3', score: 0.99 }, { id: 'invented', score: 1 }]);
        mocks.fetchShow.mockResolvedValue({ success: true, movie, dateTime: { '2026-10-25': [{ time: '2026-10-25T03:30:00Z', showId: 'show1' }] } });
        mount(<MovieAssistant />);
        fireEvent.click(screen.getByRole('button', { name: 'Mở trợ lý chọn phim' }));
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Hành động, không kinh dị' } });
        fireEvent.submit(screen.getByRole('textbox').closest('form'));
        const log = screen.getByRole('log');
        await within(log).findByText('Sky Warriors');
        expect(within(log).queryByText('Dark Planet')).toBeNull();
        fireEvent.click(screen.getByRole('button', { name: 'Lịch chiếu & đặt vé →' }));
        const booking = await screen.findByRole('link', { name: /Đặt vé/ });
        expect(booking.getAttribute('href')).toBe('/movie/1/2026-10-25');
        expect(screen.getByText('10:30')).toBeTruthy();
        expect(mocks.fetchShow).toHaveBeenCalledWith('1');
        fireEvent.click(booking);
        expect(screen.getByTestId('location').textContent).toBe('/movie/1/2026-10-25');
        expect(screen.queryByRole('dialog')).toBeNull();
    });
    it('shows model and screening errors without fabricated recommendations', async () => {
        mocks.discover.mockRejectedValue(new Error('AI unavailable'));
        mount(<MovieAssistant />);
        fireEvent.click(screen.getByRole('button', { name: 'Mở trợ lý chọn phim' }));
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'comedy' } });
        fireEvent.submit(screen.getByRole('textbox').closest('form'));
        await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('AI unavailable'));
        expect(within(screen.getByRole('log')).queryByRole('link')).toBeNull();
    });
});
