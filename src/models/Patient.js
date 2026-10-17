import mongoose from "mongoose";

const HistoryRecordSchema = new mongoose.Schema({
  date: {
    type: String, // Stored as "YYYY-MM-DD" or formatted date
    required: true,
  },
  baselineMeasurements: {
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    waistCircumference: { type: Number, required: true },
    bmi: { type: Number, required: true },
  },
  medicalHistoryNotes: {
    knownConditions: { type: String, default: "" },
    currentMedications: { type: String, default: "" },
    physicianNotes: { type: String, default: "" },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PatientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    gender: { type: String, required: true },
    contactNumber: { type: String, required: true },
    history: [HistoryRecordSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Patient ||
  mongoose.model("Patient", PatientSchema);