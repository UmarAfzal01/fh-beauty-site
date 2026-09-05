import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Appointment from '@/models/Appointment';
import { google } from 'googleapis';

function getCalendarClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });
  return google.calendar({ version: 'v3', auth });
}

export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return NextResponse.json({ success: false, error: 'Appointment not found' }, { status: 404 });
    }

    const calendar = getCalendarClient();
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

    if (status === 'active') {
      if (!appointment.googleEventId) {
        const startDateTime = new Date(`${appointment.preferredDate} ${appointment.preferredTime}`);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

        const event = {
          summary: `Appointment: ${appointment.fullName} (${appointment.service})`,
          description: `Phone: ${appointment.phone}\nType: ${appointment.patientType}\nNotes: ${appointment.message || 'None'}`,
          start: { dateTime: startDateTime.toISOString() },
          end: { dateTime: endDateTime.toISOString() },
        };

        const gResponse = await calendar.events.insert({
          calendarId: calendarId,
          resource: event,
        });

        appointment.googleEventId = gResponse.data.id;
      }
    } else if (status === 'pending') {
      if (appointment.googleEventId) {
        try {
          await calendar.events.delete({
            calendarId: calendarId,
            eventId: appointment.googleEventId,
          });
          console.log(`Successfully deleted Google Calendar event: ${appointment.googleEventId}`);
        } catch (gcErr) {
          console.error('Google Calendar Delete Error:', gcErr.errors || gcErr.message);
        }
        appointment.googleEventId = null;
      }
    }

    appointment.status = status;
    await appointment.save();

    return NextResponse.json({ success: true, data: appointment }, { status: 200 });
  } catch (error) {
    console.error('PATCH Appointment Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return NextResponse.json({ success: false, error: 'Appointment not found' }, { status: 404 });
    }

    if (appointment.googleEventId) {
      try {
        const calendar = getCalendarClient();
        await calendar.events.delete({
          calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
          eventId: appointment.googleEventId,
        });
        console.log(`Successfully deleted Google Calendar event on record removal: ${appointment.googleEventId}`);
      } catch (gcErr) {
        console.error('Google Calendar Delete Error on Remove:', gcErr.errors || gcErr.message);
      }
    }

    await Appointment.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Appointment deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('DELETE Appointment Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}