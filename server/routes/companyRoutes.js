const router = require('express').Router();
const { listCompanies, createCompany,
        getCompanyById, updateCompany,
        removeUserFromCompany, deleteCompany, manageCompanyUsers } = require("../controllers/companyController");

// Company Endpoints
router.get("/", listCompanies);
router.post("/", createCompany);
router.get("/:id", getCompanyById);  
router.put("/:id", updateCompany);
router.delete("/:id", deleteCompany);

// User Management in Company
router.patch("/:id/users", manageCompanyUsers);
router.delete("/:id/users/:userId", removeUserFromCompany);

module.exports = router;