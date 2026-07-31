const db = require("../config/db");

const categoryPalette = {
  "building materials": { color: "#2f6fed", bg: "#e9f0ff" },
  electricals: { color: "#2fa84f", bg: "#e9f9ee" },
  "food & beverages": { color: "#e8792e", bg: "#fdece0" },
  machinery: { color: "#2f8fed", bg: "#e9f3ff" },
  "general goods": { color: "#2f9e6e", bg: "#e7f7ef" },
  others: { color: "#7a5cd6", bg: "#f0ecfd" },
};

function getCategoryStyle(name) {
  const normalized = String(name || "").trim().toLowerCase();
  const direct = categoryPalette[normalized];
  if (direct) return direct;

  for (const [key, value] of Object.entries(categoryPalette)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }

  return { color: "#7a5cd6", bg: "#f0ecfd" };
}

exports.getMapCompanies = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        c.id,
        c.company_name,
        c.latitude,
        c.longitude,
        c.status,
        c.category_id,
        cat.category_name
      FROM companies c
      LEFT JOIN categories cat ON cat.id = c.category_id
      WHERE c.status IS NOT NULL
      ORDER BY c.company_name ASC
    `);

    const companies = rows.map((company) => {
      const style = getCategoryStyle(company.category_name);
      return {
        id: company.id,
        company_name: company.company_name || company.name,
        name: company.company_name || company.name,
        latitude: company.latitude,
        longitude: company.longitude,
        status: company.status,
        category_id: company.category_id,
        category_name: company.category_name,
        color: style.color,
        bg: style.bg,
      };
    });

    res.json(companies);
  } catch (error) {
    console.error("getMapCompanies error", error);
    res.status(500).json({ message: "Failed to load map companies" });
  }
};
