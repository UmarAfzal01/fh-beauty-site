import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Appointment from '@/models/Appointment';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    let query = {};
    if (date) {
      query.preferredDate = date;
    }

    const appointments = await Appointment.find(query).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        count: appointments.length,
        data: appointments,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch Appointments API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error. Please try again.' },
      { status: 500 }
    );
  }
}

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

    if (!fullName || !phone || !preferredDate || !preferredTime) {
      return NextResponse.json(
        { success: false, error: 'Please fill in all required booking fields.' },
        { status: 400 }
      );
    }

    // Save appointment document to MongoDB with default status "pending"
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
      status: 'pending',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Appointment successfully reserved as pending.',
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