const mongoose = require('mongoose');

const DentalChartSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    teeth: [{
        number: {
            type: Number,
            required: true,
            min: 1,
            max: 32
        },
        status: {
            type: String,
            enum: [
                'healthy',
                'caries',
                'filling',
                'crown',
                'bridge',
                'implant',
                'missing',
                'root_canal',
                'extraction_needed'
            ],
            default: 'healthy'
        },
        surfaces: {
            mesial: String,
            distal: String,
            buccal: String,
            lingual: String,
            occlusal: String
        },
        notes: String,
        color: String,
        lastModified: {
            type: Date,
            default: Date.now
        }
    }],
    observations: {
        type: String,
        trim: true
    },
    treatmentPlan: {
        type: String,
        trim: true
    },
    attachments: [{
        type: String, // URL to stored images/files
        description: String
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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

// Update the updatedAt timestamp before saving
DentalChartSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Add index for faster queries
DentalChartSchema.index({ patient: 1, date: -1 });

module.exports = mongoose.model('DentalChart', DentalChartSchema); 