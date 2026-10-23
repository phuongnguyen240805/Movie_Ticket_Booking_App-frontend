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

export default function CatalogMovieCard({ movie }) {
    const { image_base_url, user, getToken, favoriteMovies, setFavoriteMovies, axios } = useAppContext();
    const [saving, setSaving] = useState(false);
    const [loadingTrailer, setLoadingTrailer] = useState(false);
    const [trailerUrl, setTrailerUrl] = useState('');
    const isFavorite = (favoriteMovies || []).some(item => item._id === movie._id);
    const detailsUrl = routesConfig.movieDetailsPageGenerator(movie._id);

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

    return <article className="bg-gray-900/80 rounded-xl overflow-hidden shadow flex flex-col">
        <Link to={detailsUrl} aria-label={`View ${movie.title}`}>
            <Image src={movie.poster_path ? image_base_url + movie.poster_path : undefined} alt={movie.title} className="w-full aspect-[2/3] object-cover" loading="lazy" />
        </Link>
        <div className="p-4 flex flex-col flex-1 gap-2">
            <h3 className="font-semibold"><Link to={detailsUrl}>{movie.title}</Link></h3>
            <p className="text-xs text-gray-400">{movie.release_date || 'Release date unavailable'} · {Number(movie.vote_average || 0).toFixed(1)}/10</p>
            <p className="text-xs text-gray-400">{genreNames(movie).join(' · ')}</p>
            <p className="text-sm text-gray-300 line-clamp-3">{movie.overview}</p>
            <div className="flex flex-wrap items-center gap-3 mt-auto pt-3">
                <button onClick={handleTrailer} disabled={loadingTrailer} className="flex items-center gap-1 text-sm disabled:opacity-50"><PlayCircleIcon className="w-4 h-4" />{loadingTrailer ? 'Loading…' : 'Trailer'}</button>
                <button onClick={handleFavorite} disabled={saving} aria-pressed={isFavorite} aria-label={`${isFavorite ? 'Remove from' : 'Add to'} favorites: ${movie.title}`} className="p-2 disabled:opacity-50">
                    <Heart className={`w-5 h-5 ${isFavorite ? 'text-primary fill-primary' : ''}`} />
                </button>
                <Link to={detailsUrl} className="text-primary text-sm">Details & tickets</Link>
            </div>
        </div>
        {trailerUrl && <TrailerModal url={trailerUrl} onClose={() => setTrailerUrl('')} />}
    </article>;
}
