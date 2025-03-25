const router = require('express').Router();
const { createUser, migrateUser,
     getUser, updateUser, listUsers, deactivateUser, deleteUser } = require("../controllers/userController");

// User Endpoints
router.post("/", createUser);

router.patch("/:userId/migrate", migrateUser);
router.put("/:id", updateUser);
router.patch("/:id/deactivate", deactivateUser);

router.get("/", listUsers);
router.get("/:id", getUser);

router.delete("/:id", deleteUser);

module.exports = router;