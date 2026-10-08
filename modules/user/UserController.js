const User = require('./UserModule');
const Permission = require('../permission/PermissionModule');
const { signToken } = require('../../middleware/auth');

exports.createUser = async (req, res) => {
    try {
        const { email, pass, password, firstname, lastname, permission } = req.body;
        const rawPassword = pass || password;

        if (!email || !rawPassword || !firstname || !lastname) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        let permissionId = permission;
        if (!permissionId) {
            const regularPerm = await Permission.findOne({ description: 'regular_user' });
            permissionId = regularPerm?._id;
        }

        const newUser = await User.create({
            email,
            password: rawPassword,
            firstname,
            lastname,
            permission: permissionId,
            comments: [],
        });

        const userObj = newUser.toObject();
        delete userObj.password;

        res.status(201).json(userObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, pass, password } = req.body;
        const rawPassword = pass || password;

        if (!email || !rawPassword) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email }).populate('permission');
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(rawPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = signToken(user._id);

        res.status(200).json({
            token,
            user: {
                _id: user._id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                permission: user.permission?.description,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').populate('permission');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password').populate('permission comments');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.updateUserById = async (req, res) => {
    try {
        const updateData = req.body.user ? req.body.user : req.body;
        delete updateData.password;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};