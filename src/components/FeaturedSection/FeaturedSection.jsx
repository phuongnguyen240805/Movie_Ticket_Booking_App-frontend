import { routesConfig } from "@/configs";
import Button from "@/components/Button";

import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function FeaturedSection() {

    const navigate = useNavigate();

    return (
        <div className="px-6 md:px-16 ls:px-24 xl:px-44 overflow-hidden">

            <div className="relative flex items-center justify-between pt-20 pb-10">
                <p className="text-gray-300 font-medium text-lg">Now Showing</p>
                <Button
                    secondary
                    onClick={() => navigate(routesConfig.moviesPage)}
                    rightIcon={<ArrowRight className="group-hover:translate-x-0.5 transition w-5 h-5" />}
                    className="group flex items-center gap-2 text-gray-300 text-sm">
                    View All
                </Button>
            </div>
        </div>
    );
}

export default FeaturedSection;