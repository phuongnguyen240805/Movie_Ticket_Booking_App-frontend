import { dummyShowsData } from "@/assets/assets";
import Title from "@/components/admin/Title";
import Loading from "@/components/Loading";
import { dateFormat } from "@/lib/dateFormat";

import { useEffect, useState } from "react";

function ListShows() {

    const currency = import.meta.env.VITE_CURRENCY;

    const [show, setShow] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getAllShows = async () => {
        try {
            setShow([{
                movie: dummyShowsData[0],
                showDateTime: "2025-06-30T02:30:00.000Z",
                showPrice: 59,
                occupiedSeats: {
                    A1: "user_1",
                    B1: "user_2",
                    C1: "user_3"
                }
            }]);
            setIsLoading(false);
        } catch (error) {
            throw new Error(error.message);
        }
    };

    useEffect(() => {
        getAllShows();
    }, []);

    return !isLoading ? (
        <>
            <Title text1="List" text2="Shows" />
            <div className="max-w-4xl mt-6 overflow-x-auto">
                <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
                    <thead>
                        <tr className="bg-primary/20 text-left text-white">
                            <th className="p-2 font-medium pl-5">Movie Name</th>
                            <th className="p-2 font-medium">Show Time</th>
                            <th className="p-2 font-medium">Total Bookings</th>
                            <th className="p-2 font-medium">Earnings</th>
                        </tr>
                    </thead>

                    <tbody className="text-sm font-light">
                        {show.map((show, index) => (
                            <tr
                                key={index}
                                className="border-b border-primary/10 bg-primary/5 even:bg-primary/10"
                            >
                                <td className="p-2 min-w-45 pl-5">{show.movie.title}</td>
                                <td className="p-2">{dateFormat(show.showDateTime)}</td>
                                <td className="p-2">{Object.keys(show.occupiedSeats).length}</td>
                                <td className="p-2">
                                    {Object.keys(show.occupiedSeats).length * show.showPrice} {currency}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    ) : <Loading />;
}

export default ListShows;