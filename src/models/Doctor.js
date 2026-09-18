import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    image: { type: String, required: true },
    designation: { type: String, required: true },
    phone: { type: String },
    officePhone: { type: String },
    email: { type: String, required: true, unique: true },
    socialLinks: {
      facebook: { type: String },
      insta: { type: String },
      pinterest: { type: String },
      linkedin: { type: String },
    },
    shortBiography: { type: String },
    shortBiographyDescription: { type: String },
    educationExperience: {
      education: [{ type: String }],
      boardCertification: [{ type: String }],
      fieldOfExpertise: [{ type: String }],
      yearsOfPractice: { type: String },
    },
  },
  { timestamps: true }
);

// Updated pre-validate hook using async/await (no 'next' callback needed)
DoctorSchema.pre("validate", async function () {
  if (this.name && !this.slug) {
    let baseSlug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    let slug = baseSlug;
    let counter = 1;
    // Check uniqueness across other documents
    while (await mongoose.models.Doctor.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    this.slug = slug;
  }
});

export default mongoose.models.Doctor || mongoose.model("Doctor", DoctorSchema);