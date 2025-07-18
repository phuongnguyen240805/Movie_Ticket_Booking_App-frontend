const routes = {
    homePage: '/',
    moviesPage: '/movies',
    movieDetailsPage: '/movie/:id',
    seatLayoutPage: '/movie/:id/:date',
    myBookingsPage: '/my-bookings',
    favoritePage: '/favorites',
    movieDetailsPageGenerator: (id) => `/movie/${id}`,
    seatLayoutPageGenerator: (id, date) => `/movie/${id}/${date}`,
}

export default routes;