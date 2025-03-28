const { Company, User } = require("../models");
const getCoordinates = require("../utils/geolocation");

//listing all companies
exports.listCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll();
    res.send({
      success: true,
      data: companies
    });
  } catch (err) {
    res.status(500).send({ sucess: false, message: err.message });
  }
};

//Creating company data
exports.createCompany = async (req, res) => {
  try {
    const { name, address } = req.body;

    const { lat, lng } = await getCoordinates(address);

    const company = await Company.create({ name, address, lat, lng});
    res.status(201).send({
      success: true,
      data: company
    });
  } catch (err) {
    res.status(500).send({ sucess: false, message: err.message });
  }
};

// Get company by ID
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id, { include: User });
    if (!company) return res.status(404).send({ success: false, error: "Company not found" });
    res.send({sucess: true, data: company});
  } catch (err) {
    res.status(500).send({ sucess: false, message: err.message });
  }
};

// To Update company details
exports.updateCompany = async (req, res) => {
  try {
    await Company.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Company updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// To Delete a company
exports.deleteCompany = async (req, res) => {
  try {
    console.log(req.params.id);
    
    await Company.destroy({ where: { id: req.params.id } });
    res.json({ message: "Company deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// To Add user to company
exports.addUserToCompany = async (req, res) => {
  try {
    await User.update({ companyId: req.params.id }, { where: { id: req.params.userId } });
    res.json({ message: "User added to company" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.manageCompanyUsers = async (req, res) => {
  const { id } = req.params;
  const { userId, action } = req.body;

  try {
    const company = await Company.findByPk(id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (action === "add") {
      user.companyId = id;
    } else if (action === "remove") {
      user.companyId = null;
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }
    await user.save();
    res.json({ message: `User ${action}ed successfully`,
       companyId: id, updatedUsers: await company.getUsers() });

  } catch (error) {
    res.status(500).json({ message: "Error managing company users", error });
  }
}

// To Remove user from company
exports.removeUserFromCompany = async (req, res) => {
  try {
    await User.update({ companyId: null }, { where: { id: req.params.userId } });
    res.json({ message: "User removed from company" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};