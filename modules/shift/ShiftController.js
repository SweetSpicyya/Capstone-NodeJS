const Shift = require('./ShiftModule');

exports.getAllShifts = async (req, res) => {
    try {
        const shifts = await Shift.find().populate('userId', 'email firstname lastname');
        res.status(200).json(shifts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getShiftById = async (req, res) => {
    try {
        const shift = await Shift.findById(req.params.id).populate('userId', 'email firstname lastname');
        if (!shift) {
            return res.status(404).json({ message: 'Shift not found' });
        }
        res.status(200).json(shift);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addShift = async (req, res) => {
    try {
        const shiftData = req.body.shift ? req.body.shift : req.body;
        const userId = req.body.userId || shiftData.userId || req.user?._id;

        const newShift = await Shift.create({
            ...shiftData,
            userId,
        });

        res.status(201).json(newShift);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateShiftById = async (req, res) => {
    try {
        const updateData = req.body.shift ? req.body.shift : req.body;

        const updatedShift = await Shift.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedShift) {
            return res.status(404).json({ message: 'Shift not found' });
        }

        res.status(200).json(updatedShift);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteShift = async (req, res) => {
    try {
        const deletedShift = await Shift.findByIdAndDelete(req.params.id);
        if (!deletedShift) {
            return res.status(404).json({ message: 'Shift not found' });
        }
        res.status(200).json({ message: 'Shift deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};