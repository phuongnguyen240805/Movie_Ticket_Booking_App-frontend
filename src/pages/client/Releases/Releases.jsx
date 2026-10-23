import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import useTitle from '@/hooks';
import { filterMovies, genreNames, releaseMonth } from '@/lib/movieCatalog';
import CatalogMovieCard from '@/components/CatalogMovieCard';
import CatalogStatus from '@/components/CatalogStatus';

export default function Releases() {
    useTitle('Movie Ticket Booking - Releases');
    const { shows, showsLoading, showsError } = useAppContext();
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [calendarView, setCalendarView] = useState(false);
    const months = [...new Set(shows.map(releaseMonth).filter(Boolean))].sort().reverse();
    const month = months.includes(selectedMonth) ? selectedMonth : (months[0] || '');
    const genres = [...new Set(shows.flatMap(genreNames))].sort();
    const movies = filterMovies(shows, { month, genre: selectedGenre });
    const latest = filterMovies(shows).slice(0, 5);
    const [year, monthNumber] = month.split('-').map(Number);
    const firstDay = month ? new Date(year, monthNumber - 1, 1).getDay() : 0;
    const days = month ? new Date(year, monthNumber, 0).getDate() : 0;
    const releaseDays = new Set(movies.map(movie => Number(movie.release_date.slice(8, 10))));

    return <div className="relative min-h-[80vh] px-6 md:px-16 lg:px-32 pt-28 pb-12">
        <h1 className="text-3xl font-bold mb-2">New Releases & Release Calendar</h1>
        <p className="text-gray-400 mb-8">Release dates for movies with scheduled screenings in our cinema. Watch trailers and save your favorites.</p>
        <CatalogStatus />
        {!showsLoading && !showsError && <>
            {latest.length > 0 && <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4">Latest releases</h2>
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {latest.map(movie => <div key={movie._id} className="min-w-[220px] w-[220px] shrink-0"><CatalogMovieCard movie={movie} /></div>)}
                </div>
            </section>}
            <div className="flex flex-wrap gap-4 items-center mb-8">
                <label>Month: <select aria-label="Month" value={month} onChange={event => setSelectedMonth(event.target.value)} className="bg-gray-800 rounded px-2 py-1">
                    {!months.length && <option value="">No release dates</option>}
                    {months.map(value => <option key={value} value={value}>{new Date(`${value}-01T12:00:00`).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</option>)}
                </select></label>
                <label>Genre: <select aria-label="Genre" value={selectedGenre} onChange={event => setSelectedGenre(event.target.value)} className="bg-gray-800 rounded px-2 py-1">
                    <option value="">All genres</option>{genres.map(genre => <option key={genre}>{genre}</option>)}
                </select></label>
                <button onClick={() => setCalendarView(value => !value)} aria-expanded={calendarView} className="rounded bg-gray-800 px-4 py-2" disabled={!month}>{calendarView ? 'Hide Calendar' : 'Show Release Calendar'}</button>
            </div>
            {calendarView && month && <section className="mb-10 max-w-md bg-gray-900/80 rounded-xl p-4">
                <h2 className="font-semibold mb-3">Release Calendar</h2>
                <div className="grid grid-cols-7 text-center gap-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <span key={day} className="text-sm text-gray-400">{day}</span>)}
                    {Array.from({ length: firstDay }, (_, index) => <span key={`blank-${index}`} />)}
                    {Array.from({ length: days }, (_, index) => <span key={index} title={releaseDays.has(index + 1) ? movies.filter(movie => Number(movie.release_date.slice(8, 10)) === index + 1).map(movie => movie.title).join(', ') : undefined} className={`py-1 ${releaseDays.has(index + 1) ? 'bg-primary rounded-full font-bold' : ''}`}>{index + 1}</span>)}
                </div>
                <p className="text-xs text-gray-400 mt-3">Highlighted days show release dates for the selected genre.</p>
            </section>}
            <section>
                <h2 className="text-xl font-semibold mb-4">Movies by release date</h2>
                {movies.length === 0 ? <p className="text-center py-10 text-gray-400">{shows.length ? 'No movies found for this filter.' : 'No movies with scheduled screenings available.'}</p> :
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">{movies.map(movie => <CatalogMovieCard key={movie._id} movie={movie} />)}</div>}
            </section>
        </>}
    </div>;
}
