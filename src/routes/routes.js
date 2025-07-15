import { HomePage, MovieDetailsPage, MoviesPage, MyBookingsPage, FavoritePage, SeatLayoutPage } from "@/pages";
import { routesConfig } from "@/configs";

// public routes
const publicRoutes = [
    { path: routesConfig.homePage, component: HomePage },
    { path: routesConfig.movieDetailsPage, component: MovieDetailsPage },
    { path: routesConfig.moviesPage, component: MoviesPage },
    { path: routesConfig.myBookingsPage, component: MyBookingsPage },
    { path: routesConfig.favoritePage, component: FavoritePage },
    { path: routesConfig.seatLayoutPage, component: SeatLayoutPage },
]


// private routes
const privateRoutes = [
    // config routes
]

export { publicRoutes, privateRoutes }