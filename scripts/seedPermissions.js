const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Permission = require('../modules/permission/PermissionModule');

dotenv.config();

const seedPermissions = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('[Seeder] MongoDB Connected...');

        const defaultPermissions = [
            { description: 'admin' },
            { description: 'regular_user' }
        ];

        for (const perm of defaultPermissions) {
            const exists = await Permission.findOne({ description: perm.description });
            if (!exists) {
                await Permission.create(perm);
                console.log(`[Seeder] Permission created: ${perm.description}`);
            } else {
                console.log(`[Seeder] Permission already exists: ${perm.description}`);
            }
        }

        console.log('[Seeder] Completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error(`[Seeder Error]: ${error.message}`);
        process.exit(1);
    }
};

seedPermissions();