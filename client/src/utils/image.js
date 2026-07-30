// Reliable seeded placeholder images — deterministic per company, always resolves.
// Swap `companyImageUrl` for a real Cloudinary/S3 URL builder once the backend exists;
// every call site already passes width/height so the signature won't need to change.
export function companyImageUrl(company, width = 400, height = 400) {
  return `https://picsum.photos/seed/${company.id}/${width}/${height}`;
}

// Multiple photos per company (storefront, products, interior, etc.) for the
// detail-page carousel. Swap for `company.images` from the API once available —
// this just returns an array of seeded URLs in the meantime.
export function companyGalleryUrls(company, count = 4, width = 900, height = 500) {
  return Array.from({ length: count }, (_, i) =>
    `https://picsum.photos/seed/${company.id}-${i}/${width}/${height}`
  );
}
