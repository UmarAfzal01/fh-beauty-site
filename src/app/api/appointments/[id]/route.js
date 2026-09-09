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

// Convert "09:00 AM" to 24-hour format "09:00:00"
function convertTo24HourFormat(timeStr) {
  let [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":");
  if (modifier === "PM" && hours !== "12") {
    hours = String(parseInt(hours, 10) + 12);
  }
  if (modifier === "AM" && hours === "12") {
    hours = "00";
  }
  return `${hours.padStart(2, '0')}:${minutes}:00`;
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
        const time24 = convertTo24HourFormat(appointment.preferredTime);
        const startDateTimeStr = `${appointment.preferredDate}T${time24}`;
        
        // Calculate end time by parsing safely
// Calculate end time by parsing safely (Changed to 30 minutes)
        const startDate = new Date(`${appointment.preferredDate}T${time24}`);
        const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); 
        
        const pad = (n) => String(n).padStart(2, '0');
        const endDateTimeStr = `${endDate.getFullYear()}-${pad(endDate.getMonth() + 1)}-${pad(endDate.getDate())}T${pad(endDate.getHours())}:${pad(endDate.getMinutes())}:${pad(endDate.getSeconds())}`;

        // Explicitly set local time zone (Asia/Karachi) so Google Calendar handles the offset natively
        const timeZoneName = 'Asia/Karachi';

        const event = {
          summary: `Appointment: ${appointment.fullName} (${appointment.service})`,
          description: `Phone: ${appointment.phone}\nType: ${appointment.patientType}\nNotes: ${appointment.message || 'None'}`,
          start: { 
            dateTime: startDateTimeStr,
            timeZone: timeZoneName 
          },
          end: { 
            dateTime: endDateTimeStr,
            timeZone: timeZoneName 
          },
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