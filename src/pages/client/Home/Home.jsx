import FeaturedSection from "@/components/FeaturedSection";
import Gallery from "@/components/Gallery";
import HeroSection from "@/components/HeroSection";
import TrailersSection from "@/components/TrailersSection";
import useTitle from "@/hooks";

function Home() {

    useTitle('Movie Ticket Booking - Home');

    return (
        <>
            <HeroSection />
            <FeaturedSection />
            <Gallery />
            <TrailersSection />
        </>
    );
}

export default Home;