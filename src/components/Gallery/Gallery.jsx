import classNames from "classnames/bind";

import BlurCircle from "../BlurCircle";
import styles from "./Gallery.module.scss";
import { gallerysData } from "@/assets/assets";

const cx = classNames.bind(styles);

function Gallery() {
    return (
        <div className="relative w-full pb-20 px-6 md:px-16 ls:px-24 xl:px-44 overflow-hidden">
            <BlurCircle top="100px" left="100px" />

            <h1 className="relative pt-20 pb-10 text-3xl font-semibold text-center mx-auto">
                Discover the Latest Blockbusters
            </h1>
            <p className="text-sm text-slate-500 text-center mt-2 max-w-lg mx-auto">
                Browse our curated gallery of the newest and most popular movies now showing in theaters. Find your next favorite film and secure your seats with just a few clicks!
            </p>

            <div className={cx("gallery-list")}>
                {
                    gallerysData.map(gallery => (
                        <div
                            key={gallery.name}
                            className={cx("gallery-item")}>
                            <img className="h-full w-full object-cover object-center" src={gallery.image_path} alt="image" />
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default Gallery;