import { useEffect } from "react";

function useTitle(title = 'Movie Ticket Booking') {

    useEffect(() => {
        document.title = title;
    }, [title]);
};

export default useTitle;