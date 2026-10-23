export const genreNames = (movie) => (movie.genres || []).map(genre => typeof genre === 'string' ? genre : genre?.name).filter(Boolean);
export const releaseMonth = (movie) => /^\d{4}-\d{2}-\d{2}$/.test(movie.release_date || '') ? movie.release_date.slice(0, 7) : '';

export function filterMovies(movies, { search = '', genre = '', month = '', sort = 'newest' } = {}) {
    const query = search.trim().toLocaleLowerCase();
    return movies.filter(movie =>
        (!query || `${movie.title} ${movie.overview || ''}`.toLocaleLowerCase().includes(query)) &&
        (!genre || genreNames(movie).includes(genre)) && (!month || releaseMonth(movie) === month)
    ).sort((a, b) => sort === 'rating' ? (b.vote_average || 0) - (a.vote_average || 0)
        : (sort === 'oldest' ? 1 : -1) * (a.release_date || '').localeCompare(b.release_date || ''));
}
