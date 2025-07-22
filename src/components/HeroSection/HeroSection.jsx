import { assets } from "@/assets/assets";
import Button from "@/components/Button";
import { routesConfig } from "@/configs";
import timeFormat from "@/lib/timeFormat";
import { dummyHeroSectionData } from "@/assets/assets";

import { ArrowRight, CalendarIcon, ClockIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

function HeroSection() {

    const navigate = useNavigate();

    const [newShow, setNewShow] = useState(dummyHeroSectionData[0]);

    const fetchNewShow = () => {
        const randomIndex = Math.floor(Math.random() * dummyHeroSectionData.length);
        setNewShow(dummyHeroSectionData[randomIndex]);
    };

    useEffect(() => {
        fetchNewShow();
    }, []);

    return (
        // poster film
        <div
            className={`flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-cover bg-center h-screen`}
            style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7)0%, rgba(0,0,0,0.4)40%, rgba(0,0,0,0)100%),url(${newShow.backdrop_path})` }}
        >
            <img src={assets.marvelLogo} alt="" className="max-h-11 lg:h-11 mt-20" />

            {/* film name */}
            <h1 className="text-5xl md:text-[70px] md:leading-18 font-semibold 
            max-w-110">{newShow.title}</h1>

            <div className="flex items-center gap-4 text-gray-300">
                <span>{newShow.genres.slice(0, 2).map(genre => genre.name).join(" | ")}</span>
                <div className="flex items-center gap-1">
                    <CalendarIcon className="w-4.5 h-4.5" />
                    {new Date(newShow.release_date).getFullYear()}
                </div>
                <div className="flex items-center gap-1">
                    <ClockIcon className="w-4.5 h-4.5" />
                    {timeFormat(newShow.runtime)}
                </div>
            </div>

            {/* paragraph */}
            <p className="max-w-md text-gray-300 line-clamp-4">{newShow.overview}</p>
            <Button
                primary
                onClick={() => navigate(routesConfig.moviesPage)}
                rightIcon={<ArrowRight className="group-hover:translate-x-0.5 transition w-5 h-5" />}
                className="group gap-1 h-12 px-6 py-3 text-sm">
                Explore Movies
            </Button>

        </div>
    );
}

export default HeroSection;