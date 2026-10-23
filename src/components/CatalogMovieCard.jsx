import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, PlayCircleIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppContext } from '@/context/AppContext';
import { fetchShow } from '@/services/showService';
import { updateFavorite } from '@/services/userService';
import { genreNames } from '@/lib/movieCatalog';
import { routesConfig } from '@/configs';
import Image from '@/components/Image';
import TrailerModal from '@/components/TrailerModal';

export default function CatalogMovieCard({ movie, onExplore, expanded = false }) {
    const { image_base_url, user, getToken, favoriteMovies, setFavoriteMovies, axios } = useAppContext();
    const [saving, setSaving] = useState(false);
    const [loadingTrailer, setLoadingTrailer] = useState(false);
    const [trailerUrl, setTrailerUrl] = useState('');
    const isFavorite = (favoriteMovies || []).some(item => item._id === movie._id);
    const detailsUrl = routesConfig.movieDetailsPageGenerator(movie._id);
    const MovieTarget = onExplore ? 'button' : Link;
    const targetProps = onExplore ? { onClick: onExplore, type: 'button', 'aria-expanded': expanded } : { to: detailsUrl };
    const imagePath = onExplore ? movie.poster_path : movie.backdrop_path || movie.poster_path;

    const handleFavorite = async () => {
        if (!user) return toast.error('Please login to proceed');
        if (saving) return;
        setSaving(true);
        try {
            const result = await updateFavorite(movie._id, getToken);
            if (!result?.success) throw new Error(result?.message || 'Unable to update favorites');
            // Read persisted data because this backend also reports success on some errors.
            const { data } = await axios.get('/api/user/favorites', { headers: { Authorization: `Bearer ${await getToken()}` } });
            if (!data.success || !Array.isArray(data.movies)) throw new Error(data.message || 'Unable to load favorites');
            setFavoriteMovies(data.movies);
            const updated = data.movies.some(item => item._id === movie._id);
            if (updated === isFavorite) throw new Error('Favorite was not saved. Please try again.');
            toast.success(updated ? 'Added to favorites' : 'Removed from favorites');
        } catch (error) { toast.error(error.message); }
        finally { setSaving(false); }
    };

    const handleTrailer = async () => {
        if (loadingTrailer) return;
        setLoadingTrailer(true);
        try {
            const data = await fetchShow(movie._id);
            if (!data?.success) throw new Error(data?.message || 'Unable to load trailer');
            const video = data.trailer?.find(item => item.site === 'YouTube' && item.type === 'Trailer');
            if (!video?.key) return toast.error('No trailer available for this movie');
            setTrailerUrl(`https://www.youtube.com/watch?v=${encodeURIComponent(video.key)}`);
        } catch (error) { toast.error(error.message); }
        finally { setLoadingTrailer(false); }
    };

    return <article className={`bg-gray-900/80 rounded-xl overflow-hidden shadow ${onExplore ? 'flex' : 'flex flex-col'}`}>
        <MovieTarget {...targetProps} aria-label={`View ${movie.title}`} className={onExplore ? 'w-24 sm:w-28 shrink-0 self-stretch' : 'block'}>
            <Image src={imagePath ? image_base_url + imagePath : undefined} alt={movie.title}
                className={onExplore ? 'w-full h-full max-h-48 object-cover' : 'w-full h-32 object-cover'} loading="lazy" />
        </MovieTarget>
        <div className="p-3 flex flex-col flex-1 min-w-0 gap-1.5">
            <h3 className="font-semibold line-clamp-1"><MovieTarget {...targetProps} className="text-left">{movie.title}</MovieTarget></h3>
            <p className="text-xs text-gray-400">{movie.release_date || 'Release date unavailable'} · {Number(movie.vote_average || 0).toFixed(1)}/10</p>
            <p className="text-xs text-gray-400 line-clamp-1">{genreNames(movie).join(' · ')}</p>
            {onExplore && <p className="text-xs text-gray-300 line-clamp-1">{movie.overview}</p>}
            <div className="flex flex-wrap items-center gap-2 mt-auto pt-1">
                <button onClick={handleTrailer} disabled={loadingTrailer} className="flex items-center gap-1 text-sm disabled:opacity-50"><PlayCircleIcon className="w-4 h-4" />{loadingTrailer ? 'Loading…' : 'Trailer'}</button>
                <button onClick={handleFavorite} disabled={saving} aria-pressed={isFavorite} aria-label={`${isFavorite ? 'Remove from' : 'Add to'} favorites: ${movie.title}`} className="p-2 disabled:opacity-50">
                    <Heart className={`w-5 h-5 ${isFavorite ? 'text-primary fill-primary' : ''}`} />
                </button>
                {onExplore ? <button onClick={onExplore} aria-expanded={expanded} className="text-primary text-sm">{expanded ? 'Close overview' : 'Explore movie'}</button> : <Link to={detailsUrl} className="text-primary text-sm">Details & tickets</Link>}
            </div>
        </div>
        {trailerUrl && <TrailerModal url={trailerUrl} onClose={() => setTrailerUrl('')} />}
    </article>;
}
