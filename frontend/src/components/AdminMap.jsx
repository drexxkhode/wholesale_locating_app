import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { getCategory } from "../data/categories";

export const NIA_CENTER = [5.6037, -0.1870];

function pinIcon(color, active = false) {
  const size = active ? 34 : 28;
  const h = active ? 46 : 38;
  const svg = `
    <svg width="${size}" height="${h}" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 25 15 25s15-14.5 15-25C30 6.7 23.3 0 15 0z" fill="${color}"/>
      <circle cx="15" cy="15" r="6" fill="white"/>
    </svg>`;
  return L.divIcon({ html: svg, className: "", iconSize: [size, h], iconAnchor: [size / 2, h] });
}

// Display-only map. It either shows a single pin (pinPosition — used to
// preview a location set via "Use current location") or a list of company
// markers. It no longer supports click-to-place: locations that don't render
// clearly on the tile layer made click-picking error-prone, so location
// capture now happens through the geolocation button in CompanyForm instead.
export default function AdminMap({
  companies = [],
  height = 400,
  zoom = 13,
  center = NIA_CENTER,
  pinPosition = null,
}) {
  return (
    <div style={{ height, width: "100%", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
      <MapContainer center={pinPosition || center} zoom={zoom} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {pinPosition && (
          <Marker position={pinPosition} icon={pinIcon("#e0405a", true)} />
        )}

        {!pinPosition &&
          companies.map((c) => {
            const cat = getCategory(c.category);
            return (
              <Marker key={c.id} position={[c.lat, c.lng]} icon={pinIcon(cat.color)}>
                <Popup>
                  <div style={{ minWidth: 150 }}>
                    <div className="fw-semibold">{c.name}</div>
                    <div style={{ color: cat.color, fontSize: "0.8rem" }}>{cat.name}</div>
                    <div className="text-muted-brand" style={{ fontSize: "0.78rem" }}>{c.status}</div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
}
