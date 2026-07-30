export const categories = [
  { id: 1, slug: "building-materials", name: "Building Materials", icon: "bi-house-door-fill", color: "#2f6fed", bg: "#e9f0ff", companies: 45, status: "Active" },
  { id: 2, slug: "electricals", name: "Electricals", icon: "bi-lightning-charge-fill", color: "#2fa84f", bg: "#e9f9ee", companies: 30, status: "Active" },
  { id: 3, slug: "food-beverages", name: "Food & Beverages", icon: "bi-bag-fill", color: "#e8792e", bg: "#fdece0", companies: 20, status: "Active" },
  { id: 4, slug: "machinery", name: "Machinery", icon: "bi-gear-fill", color: "#2f8fed", bg: "#e9f3ff", companies: 18, status: "Active" },
  { id: 5, slug: "general-goods", name: "General Goods", icon: "bi-box-seam-fill", color: "#2f9e6e", bg: "#e7f7ef", companies: 12, status: "Active" },
  { id: 6, slug: "others", name: "Others", icon: "bi-grid-fill", color: "#7a5cd6", bg: "#f0ecfd", companies: 3, status: "Active" },
];

export const getCategory = (slug) => categories.find((c) => c.slug === slug) || categories[0];
