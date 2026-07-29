// Reliable seeded placeholder images — deterministic per company, always resolves.
// Swap `companyImageUrl` for a real Cloudinary/S3 URL builder once the backend exists;
// every call site already passes width/height so the signature won't need to change.
export function companyImageUrl(company, width = 400, height = 400) {
  return `https://picsum.photos/seed/${company.id}/${width}/${height}`;
}
