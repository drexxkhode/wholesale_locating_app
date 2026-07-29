// Category metadata — icons use Bootstrap Icons classes, colors match the design system
export const categories = [
  {
    slug: "building-materials",
    name: "Building Materials",
    icon: "bi-house-door-fill",
    color: "#2f6fed",
    bg: "#e9f0ff",
    count: 128,
  },
  {
    slug: "electricals",
    name: "Electricals",
    icon: "bi-lightning-charge-fill",
    color: "#2fa84f",
    bg: "#e9f9ee",
    count: 86,
  },
  {
    slug: "food-beverages",
    name: "Food & Beverages",
    icon: "bi-bag-fill",
    color: "#e8792e",
    bg: "#fdece0",
    count: 64,
  },
  {
    slug: "machinery",
    name: "Machinery",
    icon: "bi-gear-fill",
    color: "#2f8fed",
    bg: "#e9f3ff",
    count: 52,
  },
  {
    slug: "general-goods",
    name: "General Goods",
    icon: "bi-box-seam-fill",
    color: "#2f9e6e",
    bg: "#e7f7ef",
    count: 91,
  },
  {
    slug: "others",
    name: "Others",
    icon: "bi-grid-fill",
    color: "#7a5cd6",
    bg: "#f0ecfd",
    count: 37,
  },
];

export const getCategory = (slug) =>
  categories.find((c) => c.slug === slug) || categories[0];
