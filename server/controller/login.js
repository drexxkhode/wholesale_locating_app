const db           = require("../config/db");
const bcrypt       = require("bcryptjs");
const generateToken = require("../config/jwt");
const { uploadToCloudinary, deleteFromCloudinary } = require("../middleware/upload");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
  return res.status(400).json({
    message: "Authentication field and password are required.",
  });
}
    // ── 1. Check Admin ──────────────────────────────────────────
     const [rows] = await db.query(`SELECT id,company_id, name, email, username, phone, password, role, photo FROM users
WHERE email = ? OR username = ? OR phone = ?
LIMIT 1`, [email,email,email]);


        if (!rows.length)
          return res.status(401).json({ message: "Invalid credentials" });
    
        const admin  = rows[0];
        const match = await bcrypt.compare(password, admin.password);
        if (!match)
          return res.status(401).json({ message: "Invalid credentials" });

      const token = generateToken({
        id:      admin.id,
        role:    admin.role,
        company_id: admin.company_id
      });

      return res.json({
        message: "Login successful",
        token,
        admin: {
          id:         admin.id,
          fullName:   admin.name,
          email:      admin.email,
          role:       admin.role,
          company_id:    admin.company_id,
          photo:      admin.photo ?? null,
        },
      });
    } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getCompanyName = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name FROM company WHERE id = ?",
      [req.auth.company_id]
    );

    if (!rows.length)
      return res.status(404).json({ message: "Turf not found" });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
/* ================= GET ME ================================================ */
exports.getMe = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, name,username,
              email,phone, role, photo, company_id
       FROM users WHERE id = ?`,
      [req.auth.id]
    );
    if (!rows.length)
      return res.status(404).json({ message: "Admin not found" });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
