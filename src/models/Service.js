import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String, required: true },
  name: { type: String, required: true },  // From Google Login session
  email: { type: String, required: true }, // From Google Login session
  image: { type: String, required: true }, // Profile picture from Google Login session
  createdAt: { type: Date, default: Date.now }
});

const HowItWorksStepSchema = new mongoose.Schema({
  title: { type: String, required: true },       // Point name/heading
  description: { type: String, required: true }   // Point Description
});

const FAQSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }        // Long Desc
});

const ServiceSchema = new mongoose.Schema({
  // URL-friendly identifier linked to the service name
  slug: { type: String, unique: true, index: true },

  // 1. Hero Section
  hero: {
    image: { type: String, required: true },
    name: { type: String, required: true },
    shortDesc: { type: String, required: true }
  },

  // 2. About Service
  about: {
    desc: { type: String, required: true }
  },

  // 3. How it Works
  howItWorks: {
    image: { type: String, required: true },
    steps: [HowItWorksStepSchema]
  },

  // 4. Candidate Requirements
  candidateRequirements: {
    image: { type: String, required: true },
    smallDesc: { type: String, required: true },
    requirements: [{ type: String }] // Array of requirements text
  },

  // 5. Service Reviews (populated via Google Auth user session)
  reviews: [ReviewSchema],

  // 6. Quick Questions (FAQs)
  faqs: [FAQSchema]

}, { timestamps: true });

// Automatically generate a slug from the service name before saving if not provided
ServiceSchema.pre('save', function (next) {
  if (this.hero && this.hero.name && (!this.slug || this.isModified('hero.name'))) {
    this.slug = this.hero.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')    // Remove special characters
      .replace(/[\s_-]+/g, '-')     // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, '');     // Remove leading/trailing hyphens
  }
  
  // Safely check if next is a function before calling it to prevent TypeErrors
  if (typeof next === 'function') {
    next();
  }
});

// Prevent model overwrite error upon hot reloading in Next.js development
export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);