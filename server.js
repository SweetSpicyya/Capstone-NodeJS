const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});


const permissionRoutes = require('./modules/permission/PermissionRoute');
app.use('/api/permission', permissionRoutes);


const userRoutes = require('./modules/user/UserRoute');
app.use('/api/user', userRoutes);
app.use('/api/permission', permissionRoutes);


const shiftRoutes = require('./modules/shift/ShiftRoute');
app.use('/api/shifts', shiftRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`[Server running]: http://localhost:${PORT}`);
});