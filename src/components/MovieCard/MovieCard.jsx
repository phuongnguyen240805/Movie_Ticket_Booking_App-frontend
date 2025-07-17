import classNames from "classnames/bind";
import { StarIcon } from "lucide-react";
import { useNavigate } from "react-router";

import styles from './MovieCard.module.scss';
import { routesConfig } from "@/configs";
import Button from "../Button";
import timeFormat from "@/lib/timeFormat";

const cx = classNames.bind(styles);

function MovieCard({ movie }) {

    const navigate = useNavigate();

    return (
        <div className={cx('wrapper', 'w-66')}>
            <img
                className={cx('img')}
                src={movie.backdrop_path}
                alt=""
                onClick={() => navigate(routesConfig.movieDetailsPageGenerator(movie._id))}
            />

            <p className="font-semibold mt-2 truncate">{movie.title}</p>

            <p className="text-sm text-gray-400 mt-2">
                {new Date(movie.release_date).getFullYear()} - {movie.genres.slice(0, 2).map(genre => genre.name).join("|")} - {timeFormat(movie.runtime)}
            </p>

            <div className="flex items-center justify-between mt-4 pb-3">
                <Button
                    primary
                    onClick={() => navigate(routesConfig.movieDetailsPageGenerator(movie._id))}
                >
                    Buy Tickets
                </Button>
                <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
                    <StarIcon className="w-4 h-4 text-primary fill-primary" />
                    {movie.vote_average.toFixed(1)}
                </p>
            </div>
        </div>
    );
}

export default MovieCard;