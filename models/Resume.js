import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'My Resume' },
    templateId: { type: String, default: 'template1' },
    personalInfo: {
        fullName: String,
        email: String,
        phone: String,
        address: String,
        linkedin: String,
        website: String,
    },
    summary: String,
    experience: [{
        id: String,
        company: String,
        role: String,
        startDate: String,
        endDate: String,
        description: String,
    }],
    education: [{
        id: String,
        school: String,
        degree: String,
        startDate: String,
        endDate: String,
        description: String,
    }],
    skills: { type: mongoose.Schema.Types.Mixed, default: '' }, // String (HTML) or Array (Legacy)
    projects: [{
        id: String,
        name: String,
        description: String,
        link: String,
    }],
    certifications: [{
        id: String,
        name: String,
        issuer: String,
        issueDate: String,
        expiryDate: String,
        credentialId: String,
        credentialUrl: String,
    }],
    extraCurricular: [{
        id: String,
        title: String,
        organization: String,
        role: String,
        startDate: String,
        endDate: String,
        description: String,
    }]
}, { timestamps: true });

export default mongoose.model('Resume', resumeSchema);
