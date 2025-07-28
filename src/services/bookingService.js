import axios from "axios";

// [GET]: /api/booking/seats/:showId
export const fetchOccupiedSeats = async (selectedTime) => {
    try {
        const { data } = await axios.get(`/api/booking/seats/${selectedTime.showId}`);

        return data;
    } catch (error) {
        console.error(error.message);
    }
};

// [POST]: /api/booking/create
export const createBooking = async (selectedTime, selectedSeats, getToken) => {
    try {
        const { data } = await axios.post('/api/booking/create', { showId: selectedTime.showId, selectedSeats }, {
            headers: { Authorization: `Bearer ${await getToken()}` }
        });

        return data;
    } catch (error) {
        console.error(error.message);
    }
};