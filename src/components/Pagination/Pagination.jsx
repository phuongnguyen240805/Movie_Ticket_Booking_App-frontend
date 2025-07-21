import React, { useState } from "react";
import PropTypes from 'prop-types';
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import BlurCircle from "../BlurCircle";
import Button from "../Button";

function Pagination({ title, children, pageSize = 8 }) {

    const items = React.Children.toArray(children);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(items.length / pageSize);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const currentItems = items.slice(start, end);

    return (
        <div className="mb-24 relative">
            <BlurCircle top="100px" left="100px" />
            <BlurCircle bottom="50px" right="50px" />

            <h1 className="text-lg font-medium my-4">{title}</h1>
            <div className="flex flex-wrap max-lg:justify-center max-sm:justify-center gap-8">{currentItems}</div>

            {/* pagination btn */}
            {totalPages > 1 ? (
                <div className="flex gap-5 mt-14 justify-center">
                    <Button
                        primary
                        aria-label="prev"
                        className="h-12 w-16 px-2.5 group"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeftIcon className="w-6 h-6 transition group-hover:-translate-x-0.5" />
                    </Button>

                    {/* page number */}
                    <div className="flex items-center gap-4 text-sm font-medium">
                        {[...Array(totalPages)].map((_, i) => (
                            <Button
                                key={i}
                                onClick={() => handlePageChange(i + 1)}
                                className={`h-12 w-12 text-lg ${currentPage === i + 1 && "text-white border bg-primary border-primary"}`}
                            >
                                {i + 1}
                            </Button>
                        ))}
                    </div>

                    <Button
                        primary
                        aria-label="next"
                        className="h-12 w-16 px-2.5 group"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRightIcon className="w-6 h-6 transition group-hover:translate-x-0.5" />
                    </Button>
                </div>
            ) : <></>}
        </div>
    );
}

Pagination.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node.isRequired,
    pageSize: PropTypes.number,
};

export default Pagination;