const db           = require("../config/db");

//========== CATEGORY MANAGEMENT ENDPOINTS (add, update, delete) ============================
//add a new category
exports.addCategory = async (req, res) => {
  try {
    const { category_name,category_icon } = req.body;

    if (!category_name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const [exists] = await db.query(
      "SELECT id FROM categories WHERE category_name = ?",
      [category_name]
    );

    if (exists.length) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const [result] = await db.query(
      "INSERT INTO categories (category_name, icon) VALUES (?, ?)",
      [category_name, category_icon]
    );

    res.status(201).json({
      message: "Category added successfully",
      id: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//update an existing category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name, category_icon } = req.body;

    const [result] = await db.query(
      "UPDATE categories SET category_name=? ,icon=? WHERE id=?",
      [category_name, category_icon, id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM categories WHERE id=?",
      [id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//========== COMPANY MANAGEMENT ENDPOINTS (add, update, delete) FOR SUPER ADMINS ============================
//add a new company
exports.addCompany = async (req, res) => {
  try {
    const {
      company_name,
      phone,
      email,
      address,
      latitude,
      longitude,
      description
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO companies
      (company_name, phone, email, address, latitude, longitude, description)
      VALUES (?,?,?,?,?,?,?,?)`,
      [
        company_name,
        phone,
        email,
        address,
        latitude,
        longitude,
        description
      ]
    );

    res.status(201).json({
      message: "Company added successfully",
      id: result.insertId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
//update an existing company
exports.updateCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      company_name,
      phone,
      email,
      address,
      latitude,
      longitude,
      description,
      status
    } = req.body;

    const [result] = await db.query(
      `UPDATE companies
      SET
      company_name=?,
      phone=?,
      email=?,
      address=?,
      latitude=?,
      longitude=?,
      description=?,
      status=?
      WHERE id=?`,
      [
        company_name,
        phone,
        email,
        address,
        latitude,
        longitude,
        description,
        status,
        id
      ]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json({ message: "Company updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
//delete a company
exports.deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM companies WHERE id=?",
      [id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json({ message: "Company deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PRODUCT MANAGEMENT ENDPOINTS (add, update, delete) FOR A COMPANY
//add a new product
exports.addProduct = async (req, res) => {
  try {
    const { company_id, product_name, quantity = 0 } = req.body;

    const [result] = await db.query(
      "INSERT INTO products (company_id, product_name, quantity) VALUES (?,?,?)",
      [company_id, product_name, quantity]
    );

    res.status(201).json({
      message: "Product added successfully",
      id: result.insertId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//update an existing product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { company_id, product_name, quantity = 0 } = req.body;

    const [result] = await db.query(
      `UPDATE products
      SET company_id=?, product_name=?, quantity=?
      WHERE id=?`,
      [company_id, product_name, quantity, id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getProducts = async (req, res) => {
  try {
    const company_id = req.params?.company_id;
    const [rows] = await db.query(`SELECT * FROM products 
      WHERE company_id = ?
      `, [company_id]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM products WHERE id=?",
      [id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};