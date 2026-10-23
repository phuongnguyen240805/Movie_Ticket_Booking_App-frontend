# Movie Ticket Booking frontend

React + Vite frontend. MovieHub (`/blog`) and Releases (`/releases`) use the existing backend at https://movie-ticket-booking-app-backend-kfeo.onrender.com.

## Local development and deployment

Set `VITE_CLERK_PUBLISHABLE_KEY` in `.env` locally and in the Vercel project. Optional image/video settings are `VITE_TMDB_IMAGE_BASE_URL` and `VITE_TRAILER_YTB_URL`; both have defaults.

Run `npm ci`, then `npm run dev`. Browser requests use relative `/api` URLs. Vite proxies them to Render locally; the first rewrite in `vercel.json` forwards them on Vercel before the SPA fallback. `VITE_BASE_URL` is no longer required. Keep these proxy destinations in sync if the backend moves.

## Existing API integration

- `GET /api/show/all`: public cinema catalogue, deduplicated by `_id` and shared across pages.
- `GET /api/show/:movieId`: movie details, screening dates and YouTube trailers, loaded on demand.
- `POST /api/user/update-favorite`: authenticated favorite toggle using `{ movieId }`.
- `GET /api/user/favorites`: authenticated readback to refresh shared favorites and confirm persistence.

MovieHub searches titles/overviews, filters genres, sorts and paginates real movies. Releases filters the same catalogue by release month and genre and highlights matching dates on its calendar. These dates are film release dates, not screening dates.

Both pages use compact movie cards. MovieHub opens an inline notebook under the selected card with the synopsis, cast/characters, audience score and screenings loaded on demand. Each screening date links directly to the existing seat-selection route. Times are displayed in Vietnam time; booking links preserve the backend date key. Releases uses short landscape thumbnails and brief metadata.

The backend has no article feed, separate upcoming catalogue or reminder endpoint. Sample articles, broken article links and simulated reminders have been removed. Releases lists films with scheduled screenings; it does not claim to be a complete upcoming-movie feed. No backend changes are required.

## Checks

- `npm test`: component and service tests for public browsing, filters, pagination, calendar, retries, trailer selection and authenticated favorite persistence/error responses.
- `npm run lint`
- `npm run build`

Authenticated API responses are mocked in automated tests. A real signed-in account is required for an end-to-end check of favorites against Clerk/Render. Public catalogue, detail and trailer endpoints can be verified without signing in.
