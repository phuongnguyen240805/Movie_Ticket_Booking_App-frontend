import { useAppContext } from '@/context/AppContext';

export default function CatalogStatus() {
    const { showsLoading, showsError, reloadShows } = useAppContext();
    if (showsLoading) return <p role="status" className="py-12 text-center text-gray-400">Loading movies…</p>;
    if (showsError) return <div role="alert" className="py-12 text-center">
        <p>{showsError}</p><button onClick={reloadShows} className="mt-4 rounded bg-primary px-4 py-2">Try again</button>
    </div>;
    return null;
}
