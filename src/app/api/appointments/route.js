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
          subject: `Appointment Request Received: ${newAppointment.service}`,
          html: `
            <div style="font-family: Georgia, serif; color: #514C48; background-color: #FAF7F3; padding: 50px 20px; max-width: 620px; margin: 0 auto;">
              
              <!-- Container Card -->
              <div style="background-color: #ffffff; padding: 48px 36px; border-radius: 28px; border: 1px solid #E6DEC9; text-align: center;">
                
                <!-- Subtitle Top -->
                <p style="font-family: sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.25em; color: #514C48; margin-bottom: 12px; font-weight: 600;">
                  THANK YOU • ${fullName}
                </p>

                <!-- Main Heading -->
                <h1 style="font-size: 38px; color: #111111; margin-top: 0; margin-bottom: 16px; font-weight: normal; line-height: 1.15;">
                  You’re officially booked in!
                </h1>

                <!-- Sub-description -->
                <p style="font-size: 15px; color: #514C48; line-height: 1.6; max-width: 440px; margin: 0 auto 36px auto;">
                  We have received your appointment request for <strong>${newAppointment.service}</strong>. Our care team is reviewing your details.
                </p>

                <!-- Appointment Details Summary Box -->
                <div style="margin: 0 auto 36px auto; padding: 20px 24px; background-color: #FAF7F3; border-radius: 16px; border: 1px solid #E6DEC9; text-align: left; max-width: 420px;">
                  <table style="width: 100%; border-collapse: collapse; font-size: 13px; font-family: Georgia, serif;">
                    <tr>
                      <td style="padding: 6px 0; color: #514C48; opacity: 0.7;">Service:</td>
                      <td style="padding: 6px 0; color: #111; font-weight: bold; text-align: right;">${newAppointment.service}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; color: #514C48; opacity: 0.7;">Preferred Date:</td>
                      <td style="padding: 6px 0; color: #111; font-weight: bold; text-align: right;">${preferredDate}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; color: #514C48; opacity: 0.7;">Preferred Time:</td>
                      <td style="padding: 6px 0; color: #111; font-weight: bold; text-align: right;">${preferredTime}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; color: #514C48; opacity: 0.7;">Status:</td>
                      <td style="padding: 6px 0; color: #b45309; font-weight: bold; text-align: right;">Pending Review</td>
                    </tr>
                  </table>
                  ${message ? `<div style="margin-top: 10px; border-top: 1px solid #E6DEC9; padding-top: 10px; font-size: 12px; color: #514C48;"><strong style="color:#111;">Notes:</strong> ${message}</div>` : ''}
                </div>

                <!-- Progress / Status Steps Tracker (Fixed alignment for circles and numbers) -->
                <table style="width: 100%; max-width: 460px; margin: 0 auto 40px auto; border-collapse: collapse; text-align: center;">
                  <tr>
                    <!-- Step 1: Active/Done -->
                    <td style="width: 33%; vertical-align: top; padding: 0 5px;">
                      <table align="center" style="border-collapse: collapse;">
                        <tr>
                          <td style="width: 36px; height: 36px; background-color: #111; color: #fff; border-radius: 50%; text-align: center; vertical-align: middle; font-family: sans-serif; font-size: 14px; font-weight: bold;">
                            ✓
                          </td>
                        </tr>
                      </table>
                      <div style="font-family: sans-serif; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: #111; margin-top: 8px; margin-bottom: 4px;">REQUEST</div>
                      <div style="font-size: 11px; color: #514C48; opacity: 0.7; line-height: 1.3;">We've received your request.</div>
                    </td>
                    
                    <!-- Step 2: Current / Review -->
                    <td style="width: 33%; vertical-align: top; padding: 0 5px;">
                      <table align="center" style="border-collapse: collapse;">
                        <tr>
                          <td style="width: 34px; height: 34px; background-color: #FAF7F3; border: 2px solid #111; color: #111; border-radius: 50%; text-align: center; vertical-align: middle; font-family: sans-serif; font-size: 13px; font-weight: bold;">
                            2
                          </td>
                        </tr>
                      </table>
                      <div style="font-family: sans-serif; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: #111; margin-top: 8px; margin-bottom: 4px;">REVIEW</div>
                      <div style="font-size: 11px; color: #514C48; opacity: 0.7; line-height: 1.3;">Team is verifying slot.</div>
                    </td>

                    <!-- Step 3: Upcoming -->
                    <td style="width: 33%; vertical-align: top; padding: 0 5px;">
                      <table align="center" style="border-collapse: collapse;">
                        <tr>
                          <td style="width: 34px; height: 34px; background-color: #FAF7F3; border: 2px solid #D1C9B8; color: #888; border-radius: 50%; text-align: center; vertical-align: middle; font-family: sans-serif; font-size: 13px; font-weight: bold;">
                            3
                          </td>
                        </tr>
                      </table>
                      <div style="font-family: sans-serif; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin-top: 8px; margin-bottom: 4px;">CONFIRMED</div>
                      <div style="font-size: 11px; color: #888; opacity: 0.7; line-height: 1.3;">Ready for visit.</div>
                    </td>
                  </tr>
                </table>

                <!-- Action Button -->
                <div style="margin-bottom: 40px;">
                  <a href="www.drwardasikandar.com" style="background-color: #111; color: #FAF7F3; padding: 14px 32px; border-radius: 50px; font-family: sans-serif; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.2em; text-decoration: none; display: inline-block;">
                    VISIT OUR WEBSITE →
                  </a>
                </div>

                <!-- Footer Sharing / Social Section -->
                <div style="border-top: 1px solid #E6DEC9; padding-top: 24px; margin-top: 24px;">
                  <p style="font-size: 11px; color: rgba(81, 76, 72, 0.6); margin-top: 24px;">
                    Dr Warda Sikander • Thank you for choosing our care.
                  </p>
                </div>

              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Auto-mail sending failed:', emailError);
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