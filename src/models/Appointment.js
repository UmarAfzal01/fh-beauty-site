// File path: models/Appointment.js

import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide your full name.'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide your phone number.'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    patientType: {
      type: String,
      enum: ['New Patient', 'Existing Patient'],
      default: 'New Patient',
    },
    appointmentFor: {
      type: String,
      default: 'Self',
    },
    service: {
      type: String,
      required: [true, 'Please select a service.'],
    },
    preferredDate: {
      type: String,
      required: [true, 'Please select a preferred date.'],
    },
    preferredTime: {
      type: String,
      required: [true, 'Please select a preferred time slot.'],
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'Pending', 'Active'],
      default: 'Pending',
    },
    googleEventId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);