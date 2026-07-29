# North Industrial Area — Wholesale Locator (User App)

React + Vite + Bootstrap 5 frontend for the GIS-based wholesale company locator.
Built responsive: mobile app-shell (top bar + bottom nav) and desktop (top navbar), matching the provided wireframes.

## Run locally
```bash
npm install
npm run dev
```

## Build for production
```bash
npm run build
```

## Structure
- `src/data/` — mock companies & categories (swap for real API calls once backend is ready)
- `src/context/FavoritesContext.jsx` — favorites state, persisted to localStorage
- `src/components/` — shared UI: navbars, cards, map, search bar
- `src/pages/` — routed screens: Home, SearchResults, MapPage, CompanyDetail, Categories, Favorites, Menu, Directions, About, Contact

## Swapping mock data for a real API
Replace the arrays in `src/data/companies.js` / `categories.js` with fetch calls
(e.g. inside a `useEffect` + `useState`, or React Query if you add it), keeping
the same object shape so components don't need changes.

## Map
Uses Leaflet + OpenStreetMap tiles (free, no API key). Marker colors are driven
by `src/data/categories.js` so admin-added categories automatically get a color.
