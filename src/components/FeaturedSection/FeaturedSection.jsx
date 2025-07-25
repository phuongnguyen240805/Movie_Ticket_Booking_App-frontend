import { routesConfig } from "@/configs";
import Button from "@/components/Button";
import BlurCircle from "../BlurCircle";
import MovieCard from "../MovieCard";
import { useAppContext } from "@/context/AppContext";

import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

function FeaturedSection() {

    const navigate = useNavigate();
    const { shows } = useAppContext();
    const [intro, setIntro] = useState([]);

    // get ramdom film intro
    useEffect(() => {
        const randomShows = shows.slice().sort(() => Math.random() - 0.5).slice(0, 4);

        setIntro(randomShows);
    }, [navigate, shows]);

    return (
        <div className="px-6 md:px-16 ls:px-24 xl:px-44 overflow-hidden">

            <div className="relative flex items-center justify-between pt-20 pb-10">

                <BlurCircle top="0" right="-80px" />

                <p className="text-gray-300 font-medium text-lg">Now Showing</p>
                <Button
                    onClick={() => navigate(routesConfig.moviesPage)}
                    rightIcon={<ArrowRight className="group-hover:translate-x-0.5 transition w-5 h-5" />}
                    className="group gap-2 text-sm">
                    View All
                </Button>

            </div>

            <div className="flex justify-center flex-wrap max-sm:justify-center gap-8 mt-8">
                {intro.map(show => (
                        <MovieCard key={show._id} movie={show} />
                    ))
                }
            </div>

            <div className="flex justify-center mt-14 pb-20">
                <Button
                    primary
                    className="px-10 py-3"
                    onClick={() => navigate(routesConfig.moviesPage)}
                >
                    Show more
                </Button>
            </div>
        </div>
    );
}

export default FeaturedSection;