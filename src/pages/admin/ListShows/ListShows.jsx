import Title from "@/components/admin/Title";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import { dateFormat } from "@/lib/dateFormat";

function ListShows() {

    const { listShows, isLoading } = useAppContext();

    const currency = import.meta.env.VITE_CURRENCY;

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
                        {listShows.map((show, index) => (
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