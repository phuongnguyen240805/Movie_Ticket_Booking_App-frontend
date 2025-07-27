import { useEffect } from "react";
import PropTypes from 'prop-types';

function useTitle({ title = 'Movie Ticket Booking' }) {

    useEffect(() => {
        document.title = title;
    }, [title]);
};

useTitle.propTypes = {
    title: PropTypes.string.isRequired,
};

export default useTitle;