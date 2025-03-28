const { User } = require("../models");

// To create an new user
exports.createUser = async (req, res) => {
  try {
    console.log("body", req.body);
    
    const user = await User.create(req.body);
    res.status(201).send({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).send({ 
      success: false,
      message: "Error while Creating User"
     });
  }
};

// To Migrate the User
exports.migrateUser = async (req, res) => {
  try {
    // Validate input
    if (!req.body.newCompanyId) {
      return res.status(400).json({ success: false, message: "New company ID is required" });
    }

    const user = await User.findByPk(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Attempt migration
    user.companyId = req.body.newCompanyId;
    await user.save();

    console.log("Migration successful!");
    return res.json({ success: true, message: "User migrated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Migration failed", error: error.message });
  }
};

// To List all users
exports.listUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.send({
      success: true,
      data: users
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// To Get user by ID
exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).send({success: true, data: user});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// To Update user details
exports.updateUser = async (req, res) => {
  try {
    await User.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// To Deactivate a user
exports.deactivateUser = async (req, res) => {
  try {
    await User.update({ active: false }, { where: { id: req.params.id } });
    res.json({ message: "User deactivated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// To Delete a user
exports.deleteUser = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};