import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Appointment from '@/models/Appointment';
import nodemailer from 'nodemailer';

// Configure Nodemailer transporter (uses Gmail service shortcut)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

    // Conditionally send email if an email address is provided
    if (email && email.trim() !== '') {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: email,
          subject: `Appointment Request Pending: ${newAppointment.service}`,
          html: `
            <div style="font-family: Georgia, serif; color: #514C48; background-color: #FAF7F3; padding: 40px 20px; max-width: 600px; margin: 0 auto; border-radius: 24px;">
              <div style="background-color: #ffffff; padding: 32px; border-radius: 20px; border: 1px solid #E0DED8;">
                <h1 style="font-size: 24px; color: #111111; margin-top: 0; font-weight: normal;">Appointment Received (Pending)</h1>
                <p style="font-size: 14px; color: #514C48; line-height: 1.6;">
                  Dear <strong>${fullName}</strong>, we have received your appointment request. Our team will review and confirm shortly.
                </p>
                
                <div style="margin: 24px 0; padding: 16px; background-color: #FAF7F3; border-radius: 12px; border: 1px solid rgba(224, 222, 216, 0.6);">
                  <p style="margin: 4px 0; font-size: 13px;"><strong>Service:</strong> ${newAppointment.service}</p>
                  <p style="margin: 4px 0; font-size: 13px;"><strong>Date:</strong> ${preferredDate}</p>
                  <p style="margin: 4px 0; font-size: 13px;"><strong>Time:</strong> ${preferredTime}</p>
                  <p style="margin: 4px 0; font-size: 13px;"><strong>Status:</strong> Pending Review</p>
                </div>

                ${message ? `<p style="font-size: 13px; color: #514C48;"><strong>Notes:</strong> ${message}</p>` : ''}
                
                <p style="font-size: 12px; color: rgba(81, 76, 72, 0.7); margin-top: 32px; border-top: 1px solid #E0DED8; padding-top: 16px;">
                  Clinic Consultation Team • Thank you for choosing our care.
                </p>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Auto-mail sending failed:', emailError);
        // We log the error, but don't fail the booking response if mail fails
      }
    }

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