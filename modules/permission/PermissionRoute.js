const express = require('express');
const router = express.Router();
const permissionController = require('./PermissionController');

router.get('/', permissionController.getAllPermissions);

module.exports = router;