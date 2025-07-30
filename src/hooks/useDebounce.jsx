import { useEffect, useState } from "react";

function useDebounce(value, delay) {

    const [searchValue, setSearchValue] = useState(value);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setSearchValue(value);
        }, delay);

        return () => clearTimeout(timerId);
    }, [delay, value]);

    return searchValue;
};

export default useDebounce;