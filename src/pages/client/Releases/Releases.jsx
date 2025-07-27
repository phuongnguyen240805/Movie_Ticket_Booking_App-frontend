import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import MovieCard from "@/components/MovieCard";
import Button from "@/components/Button";
import { PlayCircleIcon, BellIcon, Heart } from "lucide-react";
import classNames from "classnames";
import useTitle from "@/hooks";

// Helper functions to replace dayjs
function formatDate(dateStr, format) {
    const date = new Date(dateStr);
    if (isNaN(date)) return "";
    if (format === "YYYY-MM") {
        return date.toISOString().slice(0, 7);
    }
    if (format === "MMM D, YYYY") {
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }
    if (format === "MMMM YYYY") {
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
        });
    }
    return date.toLocaleDateString();
}

function getDateObjFromYYYYMM(yyyymm) {
    // yyyymm: "2024-06"
    const [year, month] = yyyymm.split("-");
    return new Date(Number(year), Number(month) - 1, 1);
}

function getDaysInMonth(yyyymm) {
    const [year, month] = yyyymm.split("-");
    return new Date(Number(year), Number(month), 0).getDate();
}

function getFirstDayOfWeek(yyyymm) {
    // 0: Sunday, 1: Monday, ...
    const date = getDateObjFromYYYYMM(yyyymm);
    return date.getDay();
}

function getDateDay(dateStr) {
    const date = new Date(dateStr);
    return date.getDate();
}

const GENRES = [
    "Action",
    "Horror",
    "Thriller",
    "Animation",
    "Family",
    "Romance",
    "Comedy",
    "Anime",
    "Drama",
    "Adventure",
];

function Release() {

    useTitle('Movie Ticket Booking - Releases');

    const { nowPlayingMovies, image_base_url, favoriteMovies, setFavoriteMovies } = useAppContext();
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();
        return now.toISOString().slice(0, 7);
    });
    const [selectedGenre, setSelectedGenre] = useState("");
    const [calendarView, setCalendarView] = useState(false);
    const [notifyList, setNotifyList] = useState([]);
    const [trending, setTrending] = useState([]);

    // Simulate trending fetch (should be from API)
    useEffect(() => {
        if (nowPlayingMovies && nowPlayingMovies.length > 0) {
            setTrending(nowPlayingMovies.slice(0, 5));
        }
    }, [nowPlayingMovies]);

    // Filter movies by month and genre
    const filteredMovies = (nowPlayingMovies || []).filter((movie) => {
        const releaseMonth = formatDate(movie.release_date, "YYYY-MM");
        const genreMatch =
            !selectedGenre ||
            (Array.isArray(movie.genres) &&
                movie.genres.some((g) =>
                    typeof g === "string"
                        ? g === selectedGenre
                        : g?.name === selectedGenre
                ));
        return releaseMonth === selectedMonth && genreMatch;
    });

    // Get all release days in month for calendar
    const releaseDays = (nowPlayingMovies || [])
        .filter(
            (movie) =>
                formatDate(movie.release_date, "YYYY-MM") === selectedMonth
        )
        .map((movie) => getDateDay(movie.release_date));

    // Calendar rendering helpers
    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(selectedMonth);
        const firstDay = getFirstDayOfWeek(selectedMonth); // 0: Sunday
        const weeks = [];
        let day = 1 - firstDay;
        for (let w = 0; w < 6; w++) {
            const week = [];
            for (let d = 0; d < 7; d++, day++) {
                if (day < 1 || day > daysInMonth) {
                    week.push(<td key={d}></td>);
                } else {
                    const isRelease = releaseDays.includes(day);
                    week.push(
                        <td key={d} className={classNames("text-center py-1", isRelease && "bg-primary/80 text-white rounded-full font-bold")}>
                            {day}
                        </td>
                    );
                }
            }
            weeks.push(<tr key={w}>{week}</tr>);
            if (day > daysInMonth) break;
        }
        return (
            <table className="w-full text-sm mt-2">
                <thead>
                    <tr className="text-gray-400">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                            <th key={d} className="font-normal py-1">{d}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>{weeks}</tbody>
            </table>
        );
    };

    // Handle "Notify me" (simulate)
    const handleNotify = (id) => {
        setNotifyList((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    // Handle favorite (simulate)
    const handleFavorite = (movie) => {
        // setFavoriteMovies((prev) => {
        //     if (prev.find((m) => m.id === movie.id)) {
        //         return prev.filter((m) => m.id !== movie.id);
        //     }
        //     return [...prev, movie];
        // });
    };

    // Month options for filter
    const getMonthOptions = () => {
        const months = new Set(
            (nowPlayingMovies || []).map((m) =>
                formatDate(m.release_date, "YYYY-MM")
            )
        );
        return Array.from(months).sort();
    };

    return (
        <div className="relative min-h-[80vh] px-6 md:px-16 lg:px-40 xl:px-44 py-20">
           
            <h1 className="text-3xl font-bold mb-2">Upcoming & New Releases</h1>
            <p className="text-gray-400 mb-8">Stay updated with the latest and upcoming movies. Set reminders, watch trailers, and add to your favorites!</p>

            {/* Trending Upcoming */}
            {trending.length > 0 && (
                <div className="mb-10">
                    <h2 className="text-xl font-semibold mb-3">🔥 Trending Upcoming</h2>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {trending.map((movie) => (
                            <div key={movie.id} className="min-w-[220px] bg-gray-900/70 rounded-lg shadow relative">
                                <img
                                    src={image_base_url + movie.poster_path}
                                    alt={movie.title}
                                    className="rounded-t-lg h-44 w-full object-cover"
                                />
                                <div className="p-3">
                                    <p className="font-medium truncate">{movie.title}</p>
                                    <p className="text-xs text-gray-400">{formatDate(movie.release_date, "MMM D, YYYY")}</p>
                                    <div className="flex gap-2 mt-2">
                                        <Button
                                            secondary
                                            leftIcon={<PlayCircleIcon className="w-4 h-4" />}
                                            className="px-2 py-1 text-xs"
                                            onClick={() => window.open(movie.trailer_url, "_blank")}
                                        >
                                            Trailer
                                        </Button>
                                        <Button
                                            rounded
                                            onClick={() => handleFavorite(movie)}
                                            className="h-8 w-8 px-1.5"
                                        >
                                            <Heart className={classNames("w-4 h-4", favoriteMovies.find((m) => m.id === movie.id) && "text-primary fill-primary")} />
                                        </Button>
                                    </div>
                                </div>
                                <Button
                                    className={classNames(
                                        "absolute top-2 right-2 h-8 w-8 p-0 rounded-full",
                                        notifyList.includes(movie.id) ? "bg-primary text-white" : "bg-gray-800 text-primary"
                                    )}
                                    onClick={() => handleNotify(movie.id)}
                                    title="Notify me"
                                >
                                    <BellIcon className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center mb-8">
                <div>
                    <label className="text-sm text-gray-400 mr-2">Month:</label>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="bg-gray-800 text-white rounded px-2 py-1"
                    >
                        {getMonthOptions().map((m) => (
                            <option key={m} value={m}>
                                {formatDate(m + "-01", "MMMM YYYY")}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-sm text-gray-400 mr-2">Genre:</label>
                    <select
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                        className="bg-gray-800 text-white rounded px-2 py-1"
                    >
                        <option value="">All</option>
                        {GENRES.map((g) => (
                            <option key={g} value={g}>
                                {g}
                            </option>
                        ))}
                    </select>
                </div>
                <Button
                    secondary
                    className="px-4 py-1 text-sm"
                    onClick={() => setCalendarView((v) => !v)}
                >
                    {calendarView ? "Hide Calendar" : "Show Release Calendar"}
                </Button>
            </div>

            {/* Release Calendar */}
            {calendarView && (
                <div className="mb-10 max-w-md bg-gray-900/80 rounded-lg p-4 shadow">
                    <h3 className="font-semibold mb-2">Release Calendar</h3>
                    {renderCalendar()}
                    <p className="text-xs text-gray-400 mt-2">
                        <span className="inline-block w-3 h-3 bg-primary rounded-full mr-1"></span>
                        Highlighted days: Movie releases
                    </p>
                </div>
            )}

            {/* Upcoming Movies List */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Upcoming Movies</h2>
                {filteredMovies.length === 0 ? (
                    <div className="text-gray-400 text-center py-10">No movies found for this filter.</div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {filteredMovies.map((movie) => (
                            <div
                                key={movie.id}
                                className="bg-gray-900/70 rounded-lg shadow hover:-translate-y-1 transition duration-300 relative flex flex-col"
                            >
                                <div className="relative rounded-t-lg overflow-hidden aspect-[2/3]">
                                    <img
                                        src={image_base_url + movie.poster_path}
                                        alt={movie.title}
                                        className="w-full h-full object-cover brightness-90"
                                    />
                                    <Button
                                        secondary
                                        leftIcon={<PlayCircleIcon className="w-4 h-4" />}
                                        className="absolute bottom-2 left-2 px-2 py-1 text-xs"
                                        onClick={() => window.open(movie.trailer_url, "_blank")}
                                    >
                                        Trailer
                                    </Button>
                                    <Button
                                        className={classNames(
                                            "absolute top-2 right-2 h-8 w-8 p-0 rounded-full",
                                            notifyList.includes(movie.id) ? "bg-primary text-white" : "bg-gray-800 text-primary"
                                        )}
                                        onClick={() => handleNotify(movie.id)}
                                        title="Notify me"
                                    >
                                        <BellIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="p-3 flex-1 flex flex-col">
                                    <p className="font-medium truncate">{movie.title}</p>
                                    <p className="text-xs text-gray-400 mb-1">{formatDate(movie.release_date, "MMM D, YYYY")}</p>
                                    <p className="text-xs text-gray-300 line-clamp-3 mb-2">{movie.overview}</p>
                                    <div className="flex gap-2 mt-auto">
                                        <Button
                                            rounded
                                            onClick={() => handleFavorite(movie)}
                                            className="h-8 w-8 px-1.5"
                                        >
                                            <Heart className={classNames("w-4 h-4", favoriteMovies.find((m) => m.id === movie.id) && "text-primary fill-primary")} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Release;