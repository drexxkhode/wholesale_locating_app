import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import { Link } from "react-router-dom";
import { getCategory } from "../data/categories";

const NIA_CENTER = [5.5715, -0.2298];

function pinIcon(color, active = false) {
  const size = active ? 38 : 30;
  const h = active ? 50 : 40;
  const svg = `
    <svg width="${size}" height="${h}" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 25 15 25s15-14.5 15-25C30 6.7 23.3 0 15 0z" fill="${color}" stroke="${active ? "#ffffff" : "none"}" stroke-width="${active ? 1.5 : 0}"/>
      <circle cx="15" cy="15" r="${active ? 7 : 6}" fill="white"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [size, h],
    iconAnchor: [size / 2, h],
    popupAnchor: [0, -h + 4],
  });
}

function RecenterOnChange({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center[0], center[1]]);
  return null;
}

export default function CompanyMap({
  companies,
  center = NIA_CENTER,
  height = 400,
  zoom = 15,
  showUserLocation = true,
  linkToDetail = true,
  selectedId = null,
  onSelect = null,
  recenterOnCenterChange = false,
}) {
  return (
    <div style={{ height, width: "100%", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {recenterOnCenterChange && <RecenterOnChange center={center} />}

        {showUserLocation && (
          <CircleMarker
            center={center}
            radius={8}
            pathOptions={{ color: "#2f6fed", fillColor: "#2f6fed", fillOpacity: 0.9, weight: 3 }}
          />
        )}

        {companies.map((c) => {
          const cat = getCategory(c.category);
          const active = c.id === selectedId;
          return (
            <Marker
              key={c.id}
              position={[c.lat, c.lng]}
              icon={pinIcon(cat.color, active)}
              eventHandlers={onSelect ? { click: () => onSelect(c.id) } : undefined}
            >
              <Popup>
                <div style={{ minWidth: 160 }}>
                  <div className="fw-semibold">{c.name}</div>
                  <div style={{ color: cat.color, fontSize: "0.8rem" }}>{cat.name}</div>
                  <div className="text-muted-brand" style={{ fontSize: "0.78rem" }}>
                    {c.distanceKm} km away
                  </div>
                  {linkToDetail && (
                    <Link to={`/companies/${c.id}`} className="fw-semibold text-primary-brand d-inline-block mt-1" style={{ fontSize: "0.82rem" }}>
                      View Details
                    </Link>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export { NIA_CENTER };
