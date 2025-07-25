import BlurCircle from "@/components/BlurCircle";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
import { useAppContext } from "@/context/AppContext";
import { dateFormat } from "@/lib/dateFormat";
import timeFormat from "@/lib/timeFormat";

import { Helmet } from 'react-helmet-async';

function MyBookings() {

    const currency = import.meta.env.VITE_CURRENCY;

    const { image_base_url, bookings, isLoading } = useAppContext();


    return !isLoading ? (
        <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]">
            <Helmet>
                <title>Movie Ticket Booking - Booking</title>
            </Helmet>

            <BlurCircle top="100px" right="100px" />

            <Pagination title='My Bookings' pageSize={4}>
                {bookings.map((item, index) => (
                    // booking item
                    <div
                        key={index}
                        className="flex flex-col md:flex-row justify-between bg-primary/8 
                        border border-primary/20 rounded-lg mt-2 p-2 max-w-3xl w-full min-h-36 md:min-h-36"
                        style={{ minHeight: "9rem" }} // fallback for min-h-36 if not available
                    >

                        <div className="flex flex-col md:flex-row flex-1 min-h-28">
                            <img
                                src={image_base_url + item.show.movie.poster_path}
                                alt=""
                                className="md:max-w-40 aspect-video h-auto object-cover object-bottom rounded min-h-24"
                                style={{ minHeight: "6rem" }} // fallback for min-h-24 if not available
                            />

                            <div className="flex flex-col p-3 flex-1">
                                <p className="text-lg font-semibold">{item.show.movie.title}</p>
                                <p className="text-gray-400 text-sm">{timeFormat(item.show.movie.runtime)}</p>
                                <p className="text-gray-400 text-sm mt-auto">{dateFormat(item.show.showDateTime)}</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:items-end md:text-right justify-between p-3 min-w-[200px] 
                             md:min-w-[260px] flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <p className="text-2xl font-semibold mb-2">
                                    {item.show.showPrice * item.bookedSeats.length}{currency}
                                </p>
                                {!item.isPaid && (
                                    <Button
                                        primary
                                        className="px-3 py-1 mb-2 text-sm ">
                                        Pay Now
                                    </Button>
                                )}
                            </div>
                            <div className="text-sm">
                                <p>
                                    <span className="text-gray-400">Total Tickets: </span>
                                    {item.bookedSeats.length}
                                </p>
                                <p>
                                    <span className="text-gray-400">Seat Number: </span>
                                    {item.bookedSeats.join(", ")}
                                </p>
                            </div>
                        </div>

                    </div>
                ))}
            </Pagination>

        </div>
    ) : (<>
        <Helmet>
            <title>Movie Ticket Booking - Booking</title>
        </Helmet>

        <Loading />
    </>);
};

export default MyBookings;