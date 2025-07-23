import FeaturedSection from "@/components/FeaturedSection";
import Gallery from "@/components/Gallery";
import HeroSection from "@/components/HeroSection";
import TrailersSection from "@/components/TrailersSection";

import { Helmet } from 'react-helmet-async';

function Home() {

    return (
        <>
            <Helmet>
                <title>Movie Ticket Booking - Home</title>
            </Helmet>
            
            <HeroSection />
            <FeaturedSection />
            <Gallery />
            <TrailersSection />
        </>
    );
}

export default Home;