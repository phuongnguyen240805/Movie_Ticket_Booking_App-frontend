import BlurCircle from "@/components/BlurCircle";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import { routesConfig } from "@/configs";

import { ArrowRightIcon } from "lucide-react";
import { useEffect, useState } from "react";

function NotFound() {

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1200);

        // clear up function
        return () => clearTimeout(timer);
    }, []);

    return !isLoading ? (
        <div className="flex flex-col items-center justify-center h-screen text-sm max-md:px-4 py-20">
            <BlurCircle top="100px" left="100px" />
            <BlurCircle bottom="0" right="100px" />

            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                404 Not Found
            </h1>
            <div className="h-px w-80 rounded bg-gradient-to-r from-gray-400 to-gray-800 my-5 md:my-7"></div>
            <p className="md:text-xl text-gray-400 max-w-lg text-center">
                Oops! This page doesn't exist. Maybe you've entered the wrong cinema. Return home to explore movies!
            </p>

            <Button
                primary
                rightIcon={<ArrowRightIcon width={22} className="group-hover:translate-x-0.5 transition" />}
                to={routesConfig.homePage}
                className="group mt-6">
                Back to Home
            </Button>
        </div>
    ) : <Loading />;
}

export default NotFound;