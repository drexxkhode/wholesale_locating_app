const db           = require("../config/db");


exports.getSystemDetails = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM system_details LIMIT 1"
    );

    if (!rows.length) {
      return res.status(404).json({ message: "System details not found" });
    }

    res.json(rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addSystemDetails = async (req, res) => {
  try {
    const {
      system_name,
      other_name,
      system_logo,
      system_email,
      maintenance_mode,
      description
          } = req.body;

    const [exists] = await db.query(
      "SELECT id FROM system_details LIMIT 1"
    );

    if (exists.length) {
      return res.status(400).json({
        message: "System details already exist"
      });
    }

    const [result] = await db.query(
      `INSERT INTO system_details
      (
        system_name,
        tagline,
        system_logo,
        favicon,
        email,
        phone,
        address,
        maintenance_mode,
        booking_enabled,
        allow_registration,
        review_enabled,
        currency,
        facebook,
        instagram,
        twitter,
        website
      )
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        system_name,
        tagline,
        system_logo,
        favicon,
        email,
        phone,
        address,
        maintenance_mode,
        booking_enabled,
        allow_registration,
        review_enabled,
        currency,
        facebook,
        instagram,
        twitter,
        website
      ]
    );

    res.status(201).json({
      message: "System details added successfully",
      id: result.insertId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateSystemDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      system_name,
      other_name,
      system_logo,
      system_email,
      description,
      maintenance_mode
    } = req.body;

    const [result] = await db.query(
      `UPDATE system_details
      SET
      system_name=?,
      other_name=?,
      system_logo=?,
      system_email=?,
      description=?,
      maintenance_mode=? 
      WHERE id=?`,
      [
        system_name,
        other_name,
        system_logo,
        system_email,
        description,
        maintenance_mode,
        id
      ]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        message: "System details not found"
      });
    }

    res.json({
      message: "System details updated successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDatabaseSize = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        table_schema AS database_name,
        ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS size_mb
      FROM information_schema.TABLES
      WHERE table_schema = DATABASE()
      GROUP BY table_schema
    `);

    res.json(rows[0] || {
      database_name: null,
      size_mb: 0
    });

  } catch (err) {
    console.error("Database Size Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};