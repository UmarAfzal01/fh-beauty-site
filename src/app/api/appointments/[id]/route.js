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
    const { status, preferredDate, preferredTime } = body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return NextResponse.json({ success: false, error: 'Appointment not found' }, { status: 404 });
    }

    // If changing date or time, verify slot is not already booked by another active appointment
    if ((preferredDate && preferredDate !== appointment.preferredDate) || (preferredTime && preferredTime !== appointment.preferredTime)) {
      const targetDate = preferredDate || appointment.preferredDate;
      const targetTime = preferredTime || appointment.preferredTime;

      const conflicting = await Appointment.findOne({
        _id: { $ne: id },
        preferredDate: targetDate,
        preferredTime: targetTime,
        status: 'active'
      });

      if (conflicting) {
        return NextResponse.json({ 
          success: false, 
          error: `The time slot ${targetTime} on ${targetDate} is already fully booked.` 
        }, { status: 400 });
      }
    }

    const calendar = getCalendarClient();
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

    let needsCalendarUpdate = false;

    if (preferredDate && preferredDate !== appointment.preferredDate) {
      appointment.preferredDate = preferredDate;
      needsCalendarUpdate = true;
    }
    if (preferredTime && preferredTime !== appointment.preferredTime) {
      appointment.preferredTime = preferredTime;
      needsCalendarUpdate = true;
    }

    const targetStatus = status !== undefined ? status : appointment.status;

    if (targetStatus === 'active') {
      const time24 = convertTo24HourFormat(appointment.preferredTime);
      const startDate = new Date(`${appointment.preferredDate}T${time24}`);
      const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // 30 mins gap

      const pad = (n) => String(n).padStart(2, '0');
      const startDateTimeStr = `${appointment.preferredDate}T${time24}`;
      const endDateTimeStr = `${endDate.getFullYear()}-${pad(endDate.getMonth() + 1)}-${pad(endDate.getDate())}T${pad(endDate.getHours())}:${pad(endDate.getMinutes())}:${pad(endDate.getSeconds())}`;
      const timeZoneName = 'Asia/Karachi';

      const eventPayload = {
        summary: `Appointment: ${appointment.fullName} (${appointment.service})`,
        description: `Phone: ${appointment.phone}\nType: ${appointment.patientType}\nNotes: ${appointment.message || 'None'}`,
        start: { dateTime: startDateTimeStr, timeZone: timeZoneName },
        end: { dateTime: endDateTimeStr, timeZone: timeZoneName },
      };

      if (appointment.googleEventId) {
        try {
          if (needsCalendarUpdate || status === 'active') {
            await calendar.events.update({
              calendarId: calendarId,
              eventId: appointment.googleEventId,
              resource: eventPayload,
            });
          }
        } catch (gcErr) {
          console.error('Google Calendar Update Error:', gcErr.errors || gcErr.message);
        }
      } else {
        const gResponse = await calendar.events.insert({
          calendarId: calendarId,
          resource: eventPayload,
        });
        appointment.googleEventId = gResponse.data.id;
      }
    } else if (targetStatus === 'pending') {
      if (appointment.googleEventId && status === 'pending' && appointment.status !== 'pending') {
        try {
          await calendar.events.delete({
            calendarId: calendarId,
            eventId: appointment.googleEventId,
          });
        } catch (gcErr) {
          console.error('Google Calendar Delete Error:', gcErr.errors || gcErr.message);
        }
        appointment.googleEventId = null;
      }
    }

    if (status !== undefined) {
      appointment.status = status;
    }

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
      } catch (gcErr) {
        console.error('Google Calendar Delete Error:', gcErr.errors || gcErr.message);
      }
    }

    await Appointment.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Appointment deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('DELETE Appointment Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}