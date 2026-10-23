import { genreNames } from './movieCatalog';

export const normalizeText = text => String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim();
export const movieText = movie => `${movie.title}. ${genreNames(movie).join(', ')}. Cast: ${(movie.casts || []).slice(0, 6).map(cast => cast.name).join(', ')}. ${movie.overview || ''}`.slice(0, 1200);

export function searchMovies(movies, query) {
    const terms = normalizeText(query).split(/\s+/).filter(Boolean);
    return movies.filter(movie => {
        const searchable = normalizeText(`${movie.title} ${movie.overview || ''} ${genreNames(movie).join(' ')} ${(movie.casts || []).map(cast => cast.name).join(' ')}`);
        return terms.every(term => searchable.includes(term));
    })
        .sort((a, b) => Number(normalizeText(b.title).includes(normalizeText(query))) - Number(normalizeText(a.title).includes(normalizeText(query))) || (b.vote_average || 0) - (a.vote_average || 0));
}

export function similarByGenre(movies, source) {
    const names = genreNames(source);
    return movies.filter(movie => movie._id !== source._id).map(movie => ({ movie, shared: genreNames(movie).filter(name => names.includes(name)) }))
        .filter(item => item.shared.length).sort((a, b) => b.shared.length - a.shared.length || (b.movie.vote_average || 0) - (a.movie.vote_average || 0)).slice(0, 4);
}

// Explicit constraints complement the multilingual semantic model, especially negation.
const genres = [
    ['Horror', ['kinh di', 'horror', 'scary']], ['Action', ['hanh dong', 'action']],
    ['Comedy', ['hai huoc', 'phim hai', 'comedy', 'funny']], ['Romance', ['lang man', 'tinh cam', 'romance', 'romantic']],
    ['Animation', ['hoat hinh', 'animation', 'animated']], ['Family', ['gia dinh', 'family']],
    ['Science Fiction', ['khoa hoc vien tuong', 'sci-fi', 'science fiction']], ['Thriller', ['giat gan', 'thriller']],
];

export function queryConstraints(query) {
    const text = normalizeText(query);
    const excluded = [];
    const preferred = [];
    for (const [genre, words] of genres) {
        if (words.some(word => new RegExp(`(?:khong(?: thich| muon| xem)?|tranh|no|not|without)\\s+${word}`).test(text))) excluded.push(genre);
        else if (words.some(word => text.includes(word))) preferred.push(genre);
    }
    const minutes = text.match(/(?:duoi|under|less than)\s+(\d+)\s*(?:phut|minutes|min)/);
    return { excluded, preferred, maxRuntime: minutes ? Number(minutes[1]) : null };
}

export function rankSemanticResults(movies, results, { query = '', sourceId } = {}) {
    const { excluded, preferred, maxRuntime } = queryConstraints(query);
    const scores = new Map(results.map(item => [item.id, item.score]));
    const exact = normalizeText(query);
    return movies.filter(movie => movie._id !== sourceId && scores.has(movie._id) &&
        !genreNames(movie).some(name => excluded.includes(name)) &&
        (!preferred.length || preferred.some(name => genreNames(movie).includes(name))) &&
        (!maxRuntime || (movie.runtime > 0 && movie.runtime < maxRuntime)))
        .map(movie => ({ movie, score: scores.get(movie._id) + (exact && exact.includes(normalizeText(movie.title)) ? 1 : 0) }))
        .sort((a, b) => b.score - a.score).slice(0, 4);
}
