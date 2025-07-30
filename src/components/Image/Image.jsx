import { forwardRef, useState } from "react";
import PropTypes from 'prop-types';

import { assets } from "@/assets/assets";

const Image = forwardRef((
    {
        src,
        alt,
        fallback = assets.noImage, // custom picture error
        ...props
    }, ref) => {

    const [currentSrc, setCurrentSrc] = useState(src);

    const handleError = () => {
        setCurrentSrc(fallback);
    }

    return (
        <img
            ref={ref}
            className='overflow-hidden'
            src={currentSrc || src}
            alt={alt}
            {...props}
            onError={handleError}
        />
    );
})

Image.propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    className: PropTypes.string,
    fallback: PropTypes.string,
}

export default Image;