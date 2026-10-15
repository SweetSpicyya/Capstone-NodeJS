const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        start: {
            type: Date,
            required: true,
        },
        end: {
            type: Date,
            required: true,
        },
        perHour: {
            type: Number,
            required: true,
        },
        place: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: { createdAt: 'created', updatedAt: 'updated' },
        versionKey: false,
    }
);

module.exports = mongoose.model('Shift', shiftSchema);