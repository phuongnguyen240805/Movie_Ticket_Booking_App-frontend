import {
    HomePage, MovieDetailsPage, MoviesPage,
    MyBookingsPage, FavoritePage, SeatLayoutPage,
    NotFoundPage
} from "@/pages/client";
import { DashboardPage, AddShowsPage, ListBookingsPage, ListShowsPage } from "@/pages/admin";
import { routesConfig } from "@/configs";

// public routes
const publicRoutes = [
    { path: routesConfig.homePage, component: HomePage },
    { path: routesConfig.movieDetailsPage, component: MovieDetailsPage },
    { path: routesConfig.moviesPage, component: MoviesPage },
    { path: routesConfig.myBookingsPage, component: MyBookingsPage },
    { path: routesConfig.favoritePage, component: FavoritePage },
    { path: routesConfig.seatLayoutPage, component: SeatLayoutPage },
    { path: routesConfig.notFoundPage, component: NotFoundPage, layout: null },
]

// private routes
const privateRoutes = [
    { path: routesConfig.dashboardPage, component: DashboardPage },
    { path: routesConfig.addShowsPage, component: AddShowsPage },
    { path: routesConfig.listBookingsPage, component: ListBookingsPage },
    { path: routesConfig.listShowsPage, component: ListShowsPage },
]

export { publicRoutes, privateRoutes };