import { dummyHeroSectionData } from "@/assets/assets";
import FeaturedSection from "@/components/FeaturedSection";
import Gallery from "@/components/Gallery";
import HeroSection from "@/components/HeroSection";
import TrailersSection from "@/components/TrailersSection";

import { useEffect, useState } from "react";

function Home() {

    const [newShow, setNewShow] = useState(dummyHeroSectionData[0]);

    const fetchNewShow = () => {
        const randomIndex = Math.floor(Math.random() * dummyHeroSectionData.length);
        setNewShow(dummyHeroSectionData[randomIndex]);
    };

    useEffect(() => {
        fetchNewShow();
    }, []);

    return (
        <>
            <HeroSection newShow={newShow} />
            <FeaturedSection />
            <Gallery />
            <TrailersSection />
        </>
    );
}

export default Home;