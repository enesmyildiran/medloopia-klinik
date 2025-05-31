const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    country: {
        type: String,
        required: true
    },
    language: {
        type: String,
        default: 'tr'
    },
    uniqueLinkId: {
        type: String,
        required: true,
        unique: true
    },
    clinicId: {
        type: Number,
        required: true
    },
    salesUserId: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['new', 'offered', 'accepted', 'completed'],
        default: 'new'
    },
    lastAccess: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
patientSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Add virtual for offers
patientSchema.virtual('offers', {
    ref: 'Offer',
    localField: '_id',
    foreignField: 'patientId'
});

// Enable virtuals
patientSchema.set('toJSON', { virtuals: true });
patientSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Patient', patientSchema); 