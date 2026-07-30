import { useState } from "react";
import { BASE_URL } from "../api/client";

function getInitials(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";
}

function getAvatarColor(name = "") {
  const colors = ["#0d6efd", "#198754", "#dc3545", "#0dcaf0", "#6f42c1", "#fd7e14"];
  const index = (name?.charCodeAt(0) ?? 0) % colors.length;
  return colors[index];
}

function normalizePhoto(photo) {
  if (!photo) return null;

  if (typeof photo === "string") {
    const trimmed = photo.trim();
    if (!trimmed) return null;

    if (/^https?:\/\//i.test(trimmed) || /^data:/i.test(trimmed) || trimmed.startsWith("blob:")) {
      return trimmed;
    }

    if (trimmed.startsWith("/")) {
      return `${BASE_URL}${trimmed}`;
    }

    return trimmed;
  }

  if (typeof photo === "object") {
    const nested = photo.url ?? photo.secure_url ?? photo.src ?? photo.path ?? photo.image_url ?? photo.imageUrl ?? null;
    return normalizePhoto(nested);
  }

  return null;
}

export default function Avatar({
  name = "",
  photo,
  size = 38,
  className = "",
  style = {},
  imageStyle = {},
  alt = "Profile",
}) {
  const [imageError, setImageError] = useState(false);
  const displayPhoto = !imageError ? normalizePhoto(photo) : null;
  const initials = getInitials(name);
  const color = getAvatarColor(name);

  if (!displayPhoto) {
    return (
      <span
        className={`d-inline-flex align-items-center justify-content-center rounded-circle text-white ${className}`.trim()}
        style={{
          width: size,
          height: size,
          fontSize: `${Math.max(10, Math.round(size * 0.42))}px`,
          background: `linear-gradient(135deg, ${color}, ${color}cc)`,
          boxShadow: `0 6px 24px ${color}55`,
          ...style,
        }}
      >
        {initials}
      </span>
    );
  }

  return (
    <img
      src={displayPhoto}
      alt={alt}
      className={`rounded-circle ${className}`.trim()}
      onError={() => setImageError(true)}
      style={{
        width: size,
        height: size,
        objectFit: "cover",
        ...imageStyle,
      }}
    />
  );
}
