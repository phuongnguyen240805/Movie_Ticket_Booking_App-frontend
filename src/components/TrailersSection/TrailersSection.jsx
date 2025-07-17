import { dummyTrailers } from "@/assets/assets";
import BlurCircle from "../BlurCircle";
import styles from "./TrailersSection.module.scss";

import { useState } from "react";
import ReactPlayer from 'react-player';
import { PlayCircleIcon } from "lucide-react";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function TrailersSection() {

    const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);

    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
            <p className="text-gray-300 font-medium text-lg mx-auto max-w-[960px]">Trailers</p>

            <div className="relative mt-6">
                <BlurCircle top="-40px" right="-100px" />
                <ReactPlayer
                    src={currentTrailer.videoUrl}
                    controls={false}
                    className="mx-auto max-w-full"
                    width="960px"
                    height="540px"
                />
            </div>

            <div className={cx('trailers-list')}>
                {dummyTrailers.map(trailer => (
                    <div
                        key={trailer.image}
                        className={cx('trailer-item')}
                        onClick={() => setCurrentTrailer(trailer)}
                    >
                        <img src={trailer.image} alt="" className="rounded-lg w-full h-full object-cover brightness-75" />
                        <PlayCircleIcon strokeWidth={1.6} className="absolute top-1/2 left-1/2 w-5 md:w-8 h-5 md:h-12 transform 
                        -translate-x-1/2 -translate-y-1/2" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TrailersSection;