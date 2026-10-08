const Permission = require('./PermissionModule');

exports.getAllPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find();
        res.status(200).json(permissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};