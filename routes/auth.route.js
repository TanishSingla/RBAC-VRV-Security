const express = require('express');
const { isAuthenticated, isRole } = require('../middleware/auth.middleware.js');
const { signup, login, logout, refreshToken, getProfile, getAllUsers, deleteUserByAdmin, assignRoleByAdmin, routeForOnlyManagerAndAdmin } = require('../controllers/auth.controller.js');

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/refresh-token", refreshToken);
router.get("/profile", isAuthenticated, getProfile);
router.get("/getAllUsers", isAuthenticated, isRole(["admin"]), getAllUsers);
router.get("/assignRole", isAuthenticated, isRole(["admin"]), assignRoleByAdmin);
router.delete("/deleteUserByAdmin/:id", isAuthenticated, isRole(["admin"]), deleteUserByAdmin);
router.get("/admin-manager", isAuthenticated, isRole(["admin", "manager"]), routeForOnlyManagerAndAdmin);



module.exports = router; 