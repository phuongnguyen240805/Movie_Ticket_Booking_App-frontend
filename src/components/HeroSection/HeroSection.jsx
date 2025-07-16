import { assets } from "@/assets/assets";
import Button from "@/components/Button";
import { routesConfig } from "@/configs";

import { ArrowRight, CalendarIcon, ClockIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

function HeroSection() {

    const navigate = useNavigate();

    return (
        // poster film
        <div className="flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 
        bg-[url('/backgroundImage.png')] bg-cover bg-center h-screen">

            <img src={assets.marvelLogo} alt="" className="max-h-11 lg:h-11 mt-20" />

            {/* film name */}
            <h1 className="text-5xl md:text-[70px] md:leading-18 font-semibold 
            max-w-110">Guardians <br /> of the Galaxy</h1>

            <div className="flex items-center gap-4 text-gray-300">
                <span>Action | Adventure | Sci-Fi</span>
                <div className="flex items-center gap-1">
                    <CalendarIcon className="w-4.5 h-4.5" />2025
                </div>
                <div className="flex items-center gap-1">
                    <ClockIcon className="w-4.5 h-4.5" />2h 8m
                </div>
            </div>

            {/* paragraph */}
            <p className="max-w-md text-gray-300 line-clamp-4">
                "Guardians of the Galaxy" is a popular Marvel superhero team that brings together a group of misfits from across the galaxy.
                Guardians of the Galaxy franchise has become a fan favorite in the Marvel Cinematic Universe.</p>
            <Button
                primary
                onClick={() => navigate(routesConfig.moviesPage)}
                rightIcon={<ArrowRight className="group-hover:translate-x-0.5 transition w-5 h-5" />}
                className="group flex items-center gap-1 h-10 px-6 py-3 text-sm">
                Explore Movies
            </Button>

        </div>
    );
}

export default HeroSection;