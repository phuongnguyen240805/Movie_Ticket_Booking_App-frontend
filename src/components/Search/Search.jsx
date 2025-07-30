import classNames from "classnames/bind";
import { CircleXIcon, LoaderIcon, SearchIcon, XIcon } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import styles from "./Search.module.scss";
import Button from "../Button";

const cx = classNames.bind(styles);

function Search({ setBtnShowSearch }) {

    const [searchValue, setSearchValue] = useState('') // two way binding (input search)
    const [searchResult, setSearchResult] = useState([]) // search result
    const [showResult, setShowResult] = useState(false) // show result search
    const [loading, setLoading] = useState(false) // show status load

    // const debouncedValue = useDebounce(searchValue, 500) // delay action 

    const inputRef = useRef()

    // handle fetch api search result
    // useEffect(() => {
    //     if (!debouncedValue.trim()) {
    //         setSearchResult([])
    //         return;
    //     }

    //     const searchApi = async () => {
    //         setLoading(true)

    //         const result = await searchServices.search(debouncedValue)
    //         setSearchResult(result)

    //         setLoading(false)
    //     }

    //     searchApi()
    // }, [debouncedValue])

    // clear input and focus
    const handleClear = () => {
        setSearchValue('')

        inputRef.current.focus()
    }

    // handle hide result when out click
    // const handleHideResult = useCallback(() => {
    //     setShowResult(false)
    // }, [])

    return (
        <div className={cx('wrapper', "fixed inset-0 z-[1000] flex justify-center bg-slate-800/50 backdrop-blur-sm")}>
            <Button
                rounded
                className="absolute top-6 right-8 z-10 flex items-center justify-center transition-all shadow-lg w-11 h-11"
                onClick={() => setBtnShowSearch(false)}
            >
                <XIcon width={22} />
            </Button>

            {/* Centered search bar */}
            <div
                className={cx('search', 'w-full top-30 max-w-[90vw] sm:max-w-[500px]')} >
                <input
                    ref={inputRef}
                    value={searchValue}
                    placeholder="Search movie name..."
                    spellCheck={false}
                    onChange={e => setSearchValue(e.target.value.trimStart())} // ko nhap dau cach dau tien
                    onFocus={() => setShowResult(true)}
                />

                {!!searchValue && !loading && (
                    <button className={cx('clear')} onClick={handleClear}>
                        <CircleXIcon width={20} />
                    </button>
                )}
                {
                    loading &&
                    <LoaderIcon className={cx('loading')} width={20} />
                }

                <button className={cx('search-btn')} onMouseDown={e => e.preventDefault()}>
                    <SearchIcon />
                </button>
            </div>
        </div>
    );
}

export default Search;