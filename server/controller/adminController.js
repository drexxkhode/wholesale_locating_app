const db           = require("../config/db");
const bcrypt       = require("bcryptjs");

const generateToken = require("../config/jwt");

const { uploadToCloudinary, deleteFromCloudinary } = require("../middleware/upload");

const URL = process.env.REACT_APP_URL;
/* ================= PASSWORD VALIDATION ================= */

/* ================= HELPER: extract Cloudinary public_id from URL ========= */
const extractPublicId = (url) => {
  if (!url || !url.includes("cloudinary.com")) return null;
  try {
    const afterUpload = url.split("/upload/")[1];
    if (!afterUpload) return null;
    const withoutVersion = afterUpload.replace(/^v\d+\//, "");
    return withoutVersion.replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
};

/* ================= REGISTER ================= */
// Route must use: upload.single('photo') middleware before this handler
exports.register = async (req, res) => {
  try {
    if (req.auth?.role !== "warehouse_manager" && req.auth?.role !== "super_admin")
      return res.status(403).json({ message: "Not authorized" });

    const company_id = req.auth?.company_id;
    if (!company_id)
      return res.status(403).json({ message: "No company assigned" });

    const {
      name, username,  
      phone, 
      email, role, password
    } = req.body;

    const [exists] = await db.query(
      "SELECT id FROM users WHERE email = ?", [email]
    );
    if (exists.length)
      return res.status(400).json({ message: "Email already exists" });

    if (!name || !username || !phone || 
     !email ||  !role || !password)
      return res.status(400).json({ message: "Some fields are missing" });

    const hashed = await bcrypt.hash(password, 10);

    // Upload photo to Cloudinary if provided
    let photoUrl = null;
    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        "gis/admins",
        `admin_${company_id}_${Date.now()}`
      );
      photoUrl = result.secure_url;
    }

    await db.query(
      `INSERT INTO users
       (company_id, name, username, phone, 
        email, role, password, photo)
       VALUES (?,?,?,?,?,?,?,?)`,
      [
        req.auth.company_id, name, username,
        phone, 
        email,  role, hashed, photoUrl,
      ]
    );

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error("register error:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ================= LOGIN ================= */
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
          username:   admin.username,
          phone:      admin.phone,
          createdAt:  admin.created_at,
          lastLogin:  admin.last_login,
        },
      });
    } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ error: err.message });
  }
};

/* ================= UPDATE ADMIN ============================================
   Handles text fields + optional photo in one FormData request.
   Route: PUT /api/auth/update/:id  (upload.single('photo') middleware)       */
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params?.id;
    if (String(req.auth?.id) !== String(userId))
      return res.status(403).json({ message: "You can only update your own profile" });


    // Verify admin exists + get current photo for cleanup
    const [rows] = await db.query(
      "SELECT id, photo FROM users WHERE id = ?", [userId]
    );
    if (!rows.length)
      return res.status(404).json({ message: "Record not found" });

    const fields = [];
    const values = [];

    // Text fields
    [
      "name", "username",
      "phone", 
      "email", "role"
    ].forEach((key) => {
      if (req.body[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(req.body[key]);
      }
    });

    // Photo — only if a new file was uploaded
    let newPhotoUrl = null;
    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        "gis/admins",
        `admin_${userId}_${Date.now()}`
      );
      newPhotoUrl = result.secure_url;
      fields.push("photo = ?");
      values.push(newPhotoUrl);
    }

    if (!fields.length)
      return res.json({ message: "Nothing to update" });

    await db.query(
      `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
      [...values, userId]
    );

    // Delete old photo from Cloudinary AFTER successful DB save
    if (req.file && rows[0].photo) {
      const oldPublicId = extractPublicId(rows[0].photo);
      if (oldPublicId) await deleteFromCloudinary(oldPublicId).catch(() => {});
    }

    // Return updated admin so frontend can sync immediately
    const [updated] = await db.query(
      `SELECT id, company_id, name,username, phone,
              email, role, photo
       FROM users WHERE id = ?`,
      [userId]
    );

    res.json({ message: "Record updated successfully", admin: updated[0] });
  } catch (err) {
    console.error("updateUser error:", err);
    res.status(500).json({ error: "Server Error ⚠️" });
  }
};

/* ================= UPLOAD ADMIN PHOTO =====================================
   PUT /api/auth/admins/:id/photo
   Expects: upload.single('photo') middleware on the route               */
exports.uploadAdminPhoto = async (req, res) => {
  try {
    const userId = req.params?.id;
    if (!req.file)
      return res.status(400).json({ message: "No image provided" });

    // Get current photo to delete from Cloudinary after upload
    const [rows] = await db.query(
      "SELECT photo FROM users WHERE id = ? LIMIT 1", [userId]
    );
    if (!rows.length)
      return res.status(404).json({ message: "Admin not found" });

    const oldPublicId = extractPublicId(rows[0].photo);

    // Upload new photo
    const result = await uploadToCloudinary(
      req.file.buffer,
      "gis/admins",
      `admin_${userId}_${Date.now()}`
    );

    // Save new URL
    await db.query(
      "UPDATE users SET photo = ? WHERE id = ?",
      [result.secure_url, userId]
    );

    // Delete old from Cloudinary after successful DB save
    if (oldPublicId) await deleteFromCloudinary(oldPublicId);

    // Return updated admin
    const [updated] = await db.query(
      `SELECT id, company_id, name,username, phone,
              email, role, photo
       FROM users WHERE id = ? LIMIT 1`,
      [userId]
    );

    console.log(`[admin-photo] uploaded admin=${userId} public_id=${result.public_id}`);
    res.json({ message: "Photo updated", admin: updated[0] });
  } catch (err) {
    console.error("uploadAdminPhoto error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= DELETE ADMIN PHOTO =====================================
   DELETE /api/auth/admins/:id/photo                                      */
exports.deleteAdminPhoto = async (req, res) => {
  try {
    const userId = req.params?.id;
    if (String(req.auth?.id) !== String(userId))
      return res.status(403).json({ message: "You can only remove your own photo" });

    const [rows] = await db.query(
      "SELECT photo FROM users WHERE id = ? LIMIT 1", [userId]
    );
    if (!rows.length)
      return res.status(404).json({ message: "Admin not found" });

    const publicId = extractPublicId(rows[0].photo);

    // Clear from DB first
    await db.query("UPDATE users SET photo = NULL WHERE id = ?", [userId]);

    // Then delete from Cloudinary
    if (publicId) await deleteFromCloudinary(publicId);

    const [updated] = await db.query(
      `SELECT id, company_id, name,username, phone,
              email, role, photo
       FROM users WHERE id = ? LIMIT 1`,
      [userId]
    );

    console.log(`[admin-photo] removed admin=${userId}`);
    res.json({ message: "Photo removed", admin: updated[0] });
  } catch (err) {
    console.error("deleteAdminPhoto error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= DELETE ADMIN (COMPANY) ========================================== */
exports.deleteCompanyUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    const requesterId = req.auth?.id;
    const requesterRole = req.auth?.role;
    if (!requesterId)
      return res.status(403).json({ message: "Admin access required" });
    if (requesterRole !== "warehouse_manager" && requesterRole !== "super_admin") {
      return res.status(403).json({ message: "Only managers and super admins can delete users" });
    }

    const [rows] = await db.query(
      "SELECT photo FROM users WHERE id = ?", [targetId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "User does not exist" });
    }
    if (rows[0].photo) {
      await deleteFromCloudinary(extractPublicId(rows[0].photo));
    }

    await db.query("DELETE FROM users WHERE id = ?", [targetId]);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= GET ADMIN BY ID (COMPANY) ======================================= */
exports.getAdminDetails = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, company_id, name,username, phone,
              email, role, photo, created_at
       FROM users WHERE id = ?`,
      [req.params.id]
    );
    if (!rows.length)
      return res.status(404).json({ message: "Admin not found" });

    res.json(rows[0]); // photo is already a Cloudinary URL or null
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= GET ALL ADMINS (COMPANY) ======================================== */
exports.getAllCompanyAdmins = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, company_id, name,username, phone,
              email, role, photo, last_login, created_at
       FROM users WHERE company_id = ?`,
      [req.auth?.company_id]
    );
    res.json(rows); // photos are already Cloudinary URLs or null
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// ================= GET ALL ADMINS (SUPER ADMIN) ======================================== */
exports.getAllAdmins = async (req, res) => {
  try {
    if (req.auth?.role !== "super_admin")
      return res.status(403).json({ message: "Super admin access required" });
    const [rows] = await db.query(
      `SELECT id, company_id, name,username, phone,
              email, role, photo, created_at
       FROM users WHERE role IN ('super_admin', 'warehouse_manager', 'warehouse_user','user')`
    );
    res.json(rows); // photos are already Cloudinary URLs or null
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= GET ME ================================================ */
exports.getMe = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, company_id, name,username,
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


exports.getCompanyName = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name FROM company WHERE id = ?",
      [req.auth.company_id]
    );

    if (!rows.length)
      return res.status(404).json({ message: "Company not found" });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ──Super Admin: dashboard stats ─────────────────────────────────────────────────
exports.getDashboardDetails = async (req, res) => {
  try {
    const superId = req.auth?.id;
    if (!superId) return res.status(403).json({ message: 'Admin access required' });
    const cacheKey = redis.KEYS.dashboardAll;

    // ── Cache check ───────────────────────────────────────────────────────
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`[cache] HIT dashboard:super_admin`);
      return res.json(cached);
    }

    const [rows] = await db.execute(
  `SELECT 
    (SELECT COUNT(*) FROM users ) AS total_users,
    (SELECT COUNT(*) FROM company ) AS total_companies,
    (SELECT COUNT(*) FROM products ) AS total_products,
    (SELECT COUNT(*) FROM categories  ) AS total_categories,
`
);

    const payload = rows[0];

    // ── Cache store ───────────────────────────────────────────────────────
    await redis.set(cacheKey, payload, redis.TTL.dashboardAll);
    console.log(`[cache] MISS dashboard:super_admin — cached`);

    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
