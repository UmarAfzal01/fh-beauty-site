// File path: app/api/appointments/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Appointment from '@/models/Appointment';

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const {
      fullName,
      phone,
      email,
      patientType,
      appointmentFor,
      service,
      preferredDate,
      preferredTime,
      message,
    } = body;

    // Validation
    if (!fullName || !phone || !preferredDate || !preferredTime) {
      return NextResponse.json(
        { success: false, error: 'Please fill in all required booking fields.' },
        { status: 400 }
      );
    }

    // Save appointment document to MongoDB
    const newAppointment = await Appointment.create({
      fullName,
      phone,
      email: email || '',
      patientType: patientType || 'New Patient',
      appointmentFor: appointmentFor || 'Self',
      service: service || 'Clinic Consultation',
      preferredDate,
      preferredTime,
      message: message || '',
      status: 'Confirmed',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Appointment successfully reserved.',
        data: newAppointment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Appointment API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error. Please try again.' },
      { status: 500 }
    );
  }
}