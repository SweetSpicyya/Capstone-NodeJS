const express = require('express');
const router = express.Router();
const shiftController = require('./ShiftController');
const { verifyToken, isAdmin } = require('../../middleware/auth');

router.get('/', verifyToken, isAdmin, shiftController.getAllShifts);
router.get('/:id', verifyToken, shiftController.getShiftById);
router.post('/', verifyToken, shiftController.addShift);
router.patch('/:id', verifyToken, shiftController.updateShiftById);
router.delete('/:id', verifyToken, isAdmin, shiftController.deleteShift);

module.exports = router;