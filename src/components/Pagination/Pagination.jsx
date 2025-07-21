import React, { useState } from "react";
import PropTypes from 'prop-types';

import Button from "../Button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

function Pagination({ title, children, pageSize = 8 }) {

    // const items = React.Children.toArray(children);
    const [currentPage, setCurrentPage] = useState(1);

    // const totalPages = Math.ceil(items.length / pageSize);

    // const handlePageChange = (page) => {
    //     if (page >= 1 && page <= totalPages) setCurrentPage(page);
    // };

    // const startIdx = (currentPage - 1) * pageSize;
    // const endIdx = startIdx + pageSize;
    // const currentItems = items.slice(startIdx, endIdx);

    return (
        <div className="mb-24">
            {/* <p>{title}</p>
            <div>{currentItems}</div> */}
            <h1 className="text-lg font-medium my-4">{title}</h1>
            <div className="flex flex-wrap max-lg:justify-center max-sm:justify-center gap-8">{children}</div>

            {/* pagination btn */}
            <div className="flex gap-5 mt-14 justify-center">
                <Button
                    primary
                    type="button" aria-label="prev" className="h-12 w-16 px-2.5 group"
                // onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
                >
                    <ChevronLeftIcon className="w-6 h-6 transition group-hover:-translate-x-0.5" />
                </Button>

                {/* page number */}
                {/* {[...Array(totalPages)].map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => handlePageChange(idx + 1)}
                        className={`h-10 w-10 flex items-center justify-center aspect-square 
                            ${currentPage === idx + 1 && "text-primary /500 border border-primary/200 rounded-full"}`}
                    >
                    {idx + 1}
                </button>
                ))} */}

                <div className="flex items-center gap-4 text-sm font-medium">
                    {[...Array(5)].map((_, i) => (
                        <Button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`h-12 w-12 aspect-square text-lg
                            ${currentPage === i + 1 && "text-white border bg-primary border-primary"}`}
                        >
                            {i + 1}
                        </Button>
                    ))}
                </div>

                <Button
                    primary
                    type="button" aria-label="next" className="h-12 w-16 px-2.5 group"
                // onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
                >
                    <ChevronRightIcon className="w-6 h-6 transition group-hover:translate-x-0.5" />
                </Button>
            </div>
        </div>
    );
}

Pagination.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node.isRequired,
    // pageSize: PropTypes.number,
};

export default Pagination;