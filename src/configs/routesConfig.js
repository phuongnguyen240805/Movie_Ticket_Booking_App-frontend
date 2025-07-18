const routes = {
    // client
    homePage: '/',
    moviesPage: '/movies',
    movieDetailsPage: '/movie/:id',
    seatLayoutPage: '/movie/:id/:date',
    myBookingsPage: '/my-bookings',
    favoritePage: '/favorites',
    movieDetailsPageGenerator: (id) => `/movie/${id}`,
    seatLayoutPageGenerator: (id, date) => `/movie/${id}/${date}`,

    // admin
    admin: '/admin',
    dashboardPage: '/admin',
    addShowsPage: '/admin/add-shows',
    listBookingsPage: '/admin/list-bookings',
    listShowsPage: '/admin/list-shows',
}

export default routes;