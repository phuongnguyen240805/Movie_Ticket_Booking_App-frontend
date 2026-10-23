import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Blog from '@/pages/client/Blog/Blog';
import Releases from '@/pages/client/Releases/Releases';
import CatalogMovieCard from '@/components/CatalogMovieCard';
import { filterMovies } from '@/lib/movieCatalog';

const mocks = vi.hoisted(() => ({ context: {}, fetchShow: vi.fn(), updateFavorite: vi.fn(), error: vi.fn(), success: vi.fn() }));
vi.mock('@/context/AppContext', () => ({ useAppContext: () => mocks.context }));
vi.mock('@/services/showService', () => ({ fetchShow: mocks.fetchShow }));
vi.mock('@/services/userService', () => ({ updateFavorite: mocks.updateFavorite }));
vi.mock('react-hot-toast', () => ({ default: { error: mocks.error, success: mocks.success } }));
vi.mock('@/components/TrailerModal', () => ({ default: ({ url, onClose }) => <div role="dialog"><a href={url}>Video</a><button onClick={onClose}>Close trailer</button></div> }));

const movie = { _id: '101', title: 'First Movie', overview: 'A brave adventure', genres: [{ name: 'Action' }], release_date: '2026-10-01', vote_average: 8 };
const older = { ...movie, _id: '102', title: 'Older Comedy', overview: 'A funny story', genres: [{ name: 'Comedy' }], release_date: '2026-09-30', vote_average: 9 };
const mount = element => render(<MemoryRouter>{element}</MemoryRouter>);
afterEach(cleanup);
beforeEach(() => {
    mocks.fetchShow.mockReset();
    mocks.updateFavorite.mockReset();
    mocks.context = { shows: [movie, older], showsLoading: false, showsError: '', reloadShows: vi.fn(), favoriteMovies: [], setFavoriteMovies: vi.fn(), user: null, getToken: vi.fn().mockResolvedValue('token'), axios: { get: vi.fn() }, image_base_url: 'https://image.tmdb.org/t/p/original' };
});

describe('MovieHub and Releases', () => {
    it('renders backend movies with working detail links and no sample articles', () => {
        mount(<Blog />);
        expect(screen.getByRole('heading', { name: 'MovieHub' })).toBeTruthy();
        expect(screen.getByRole('button', { name: 'View First Movie' }).getAttribute('aria-expanded')).toBe('false');
        expect(screen.queryByText(/Bài viết mẫu/)).toBeNull();
    });
    it('searches titles and overviews and filters by backend genres', () => {
        mount(<Blog />);
        fireEvent.change(screen.getByRole('textbox', { name: 'Search movies' }), { target: { value: ' BRAVE ' } });
        expect(screen.getAllByRole('article')).toHaveLength(1);
        fireEvent.change(screen.getByRole('combobox', { name: 'Genre' }), { target: { value: 'Comedy' } });
        expect(screen.getByText('No movies found.')).toBeTruthy();
    });
    it('sorts and paginates and resets pagination when filtering', () => {
        mocks.context.shows = Array.from({ length: 8 }, (_, index) => ({ ...movie, _id: String(index), title: `Film ${index}`, release_date: `2026-10-0${index + 1}` }));
        mount(<Blog />);
        expect(screen.getAllByRole('article')).toHaveLength(6);
        fireEvent.click(screen.getByRole('button', { name: 'Next' }));
        expect(screen.getAllByRole('article')).toHaveLength(2);
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Film 7' } });
        expect(screen.getAllByRole('article')).toHaveLength(1);
        expect(screen.getByRole('button', { name: 'View Film 7' })).toBeTruthy();
    });
    it('shows loading and retry states rather than an empty catalogue', () => {
        mocks.context.showsLoading = true;
        const view = mount(<Releases />);
        expect(screen.getByRole('status').textContent).toContain('Loading');
        expect(screen.queryByText(/No movies/)).toBeNull();
        mocks.context.showsLoading = false;
        mocks.context.showsError = 'Network unavailable';
        view.rerender(<MemoryRouter><Releases /></MemoryRouter>);
        expect(screen.getByRole('alert').textContent).toContain('Network unavailable');
        fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
        expect(mocks.context.reloadShows).toHaveBeenCalledOnce();
    });
    it('allows guests to browse releases and highlights the exact release day', () => {
        mount(<Releases />);
        expect(screen.getByRole('combobox', { name: 'Month' }).value).toBe('2026-10');
        fireEvent.click(screen.getByRole('button', { name: 'Show Release Calendar' }));
        expect(screen.getByTitle('First Movie').textContent).toBe('1');
        fireEvent.change(screen.getByRole('combobox', { name: 'Month' }), { target: { value: '2026-09' } });
        expect(screen.getByTitle('Older Comedy').textContent).toBe('30');
        fireEvent.change(screen.getByRole('combobox', { name: 'Genre' }), { target: { value: 'Action' } });
        expect(screen.getByText('No movies found for this filter.')).toBeTruthy();
        expect(screen.queryByTitle('Older Comedy')).toBeNull();
    });
    it('renders an honest empty state without admin-only data', () => {
        mocks.context.shows = [];
        mount(<Releases />);
        expect(screen.getByText('No movies with scheduled screenings available.')).toBeTruthy();
    });
    it('combines month, genre and rating without mutating source data', () => {
        const input = [movie, older];
        expect(filterMovies(input, { sort: 'rating' })[0]._id).toBe('102');
        expect(filterMovies(input, { month: '2026-10', genre: 'Comedy' })).toEqual([]);
        expect(input[0]).toBe(movie);
    });
});

describe('backend movie actions', () => {
    it('opens an inline movie notebook with cast, rating, screenings and a direct booking link', async () => {
        mocks.fetchShow.mockResolvedValue({ success: true, movie: { ...movie, runtime: 110, casts: [{ id: 1, name: 'Actor One', character: 'The hero' }] }, dateTime: { '2026-10-25': [{ showId: 'show-1', time: '2026-10-25T03:30:00Z' }] } });
        mount(<Blog />);
        expect(mocks.fetchShow).not.toHaveBeenCalled();
        fireEvent.click(screen.getByRole('button', { name: 'View First Movie' }));
        const panel = screen.getByRole('region', { name: 'First Movie overview' });
        await within(panel).findByText('Actor One');
        expect(within(panel).getByText('The hero')).toBeTruthy();
        expect(within(panel).getByText('Audience rating')).toBeTruthy();
        expect(within(panel).getByText('10:30')).toBeTruthy();
        expect(within(panel).getByRole('link', { name: 'Book tickets for First Movie on 2026-10-25' }).getAttribute('href')).toBe('/movie/101/2026-10-25');
        expect(mocks.fetchShow).toHaveBeenCalledWith('101');
        fireEvent.click(screen.getByRole('button', { name: 'Close overview' }));
        expect(screen.queryByRole('region', { name: 'First Movie overview' })).toBeNull();
    });
    it('handles unavailable screenings and retries a failed fetch within the item', async () => {
        mocks.fetchShow.mockResolvedValueOnce(undefined).mockResolvedValueOnce({ success: true, movie, dateTime: {} });
        mount(<Blog />);
        fireEvent.click(screen.getByRole('button', { name: 'View First Movie' }));
        await screen.findByRole('alert');
        fireEvent.click(screen.getByRole('button', { name: 'Retry screenings' }));
        await screen.findByText('No screenings currently available.');
        expect(screen.queryByRole('link', { name: /Book tickets for/ })).toBeNull();
    });
    it('ignores a late response for a movie that has been closed', async () => {
        let resolve;
        mocks.fetchShow.mockReturnValue(new Promise(done => { resolve = done; }));
        mount(<Blog />);
        fireEvent.click(screen.getByRole('button', { name: 'View First Movie' }));
        fireEvent.click(screen.getByRole('button', { name: 'Close overview' }));
        resolve({ success: true, movie, dateTime: {} });
        await waitFor(() => expect(screen.queryByRole('region', { name: 'First Movie overview' })).toBeNull());
    });
    it('fetches the trailer by backend _id and only plays a YouTube trailer', async () => {
        mocks.fetchShow.mockResolvedValue({ success: true, trailer: [{ site: 'Vimeo', type: 'Trailer', key: 'wrong' }, { site: 'YouTube', type: 'Trailer', key: 'right' }] });
        mount(<CatalogMovieCard movie={movie} />);
        fireEvent.click(screen.getByRole('button', { name: 'Trailer' }));
        await screen.findByRole('dialog');
        expect(mocks.fetchShow).toHaveBeenCalledWith('101');
        expect(within(screen.getByRole('dialog')).getByRole('link').getAttribute('href')).toBe('https://www.youtube.com/watch?v=right');
        fireEvent.click(screen.getByRole('button', { name: 'Close trailer' }));
        expect(screen.queryByRole('dialog')).toBeNull();
    });
    it('handles missing trailers and request failures without opening invalid URLs', async () => {
        mocks.fetchShow.mockResolvedValueOnce({ success: true, trailer: [] }).mockResolvedValueOnce(undefined);
        mount(<CatalogMovieCard movie={movie} />);
        fireEvent.click(screen.getByRole('button', { name: 'Trailer' }));
        await waitFor(() => expect(mocks.error).toHaveBeenCalledWith('No trailer available for this movie'));
        fireEvent.click(screen.getByRole('button', { name: 'Trailer' }));
        await waitFor(() => expect(mocks.error).toHaveBeenCalledWith('Unable to load trailer'));
        expect(screen.queryByRole('dialog')).toBeNull();
    });
    it('requires login before mutating favorites', () => {
        mount(<CatalogMovieCard movie={movie} />);
        fireEvent.click(screen.getByRole('button', { name: /Add to favorites/ }));
        expect(mocks.updateFavorite).not.toHaveBeenCalled();
        expect(mocks.error).toHaveBeenCalledWith('Please login to proceed');
    });
    it.each([false, true])('persists favorite toggle and refreshes shared state (initial=%s)', async initial => {
        mocks.context.user = { id: 'user' };
        mocks.context.favoriteMovies = initial ? [movie] : [];
        const expected = initial ? [] : [movie];
        mocks.updateFavorite.mockResolvedValue({ success: true });
        mocks.context.axios.get.mockResolvedValue({ data: { success: true, movies: expected } });
        mount(<CatalogMovieCard movie={movie} />);
        fireEvent.click(screen.getByRole('button', { name: /favorites:/ }));
        await waitFor(() => expect(mocks.context.setFavoriteMovies).toHaveBeenCalledWith(expected));
        expect(mocks.updateFavorite).toHaveBeenCalledWith('101', mocks.context.getToken);
        expect(mocks.context.axios.get).toHaveBeenCalledWith('/api/user/favorites', { headers: { Authorization: 'Bearer token' } });
    });
    it('does not report success for a malformed backend favorites response', async () => {
        mocks.context.user = { id: 'user' };
        mocks.updateFavorite.mockResolvedValue({ success: true });
        mocks.context.axios.get.mockResolvedValue({ data: { success: true, message: 'Unauthorized' } });
        mount(<CatalogMovieCard movie={movie} />);
        fireEvent.click(screen.getByRole('button', { name: /Add to favorites/ }));
        await waitFor(() => expect(mocks.error).toHaveBeenCalledWith('Unauthorized'));
        expect(mocks.context.setFavoriteMovies).not.toHaveBeenCalled();
        expect(mocks.success).not.toHaveBeenCalled();
    });
});
