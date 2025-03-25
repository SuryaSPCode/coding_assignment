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
    const { userId } = req.params;
    const { newCompanyId } = req.body;

    console.log("Received Migration Request:", { userId, newCompanyId });

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if the target company exists
    const company = await Company.findByPk(newCompanyId);
    if (!company) {
      return res.status(404).json({ success: false, message: "Target company not found" });
    }

    // Update the user's companyId
    user.companyId = newCompanyId;
    await user.save();

    console.log("Updated User:", user);

    res.json({ success: true, message: "User migrated successfully", user });
  } catch (error) {
    console.error("Migration Error:", error);
    res.status(500).json({ success: false, message: "Migration failed", error });
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