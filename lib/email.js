import { Resend } from "resend";
function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}
export async function sendAdminNotification(booking) {
  const resend = getResend();
  if (!resend || !process.env.ADMIN_NOTIFICATION_EMAIL || !process.env.EMAIL_FROM) return;
  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_NOTIFICATION_EMAIL,
    subject: `New Booking Pending Review - ${booking.artist_name} - ${booking.booking_date} ${booking.booking_time}`,
    html: `<h2>New booking pending review</h2>
      <p><strong>Client:</strong> ${booking.client_name}</p>
      <p><strong>Artist:</strong> ${booking.artist_name}</p>
      <p><strong>Service:</strong> ${booking.service_name}</p>
      <p><strong>Date:</strong> ${booking.booking_date}</p>
      <p><strong>Time:</strong> ${booking.booking_time}</p>
      <p><strong>Booking Ref:</strong> ${booking.booking_reference}</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/bookings/${booking.id}">Review booking</a></p>`
  });
}
export async function sendClientStatusEmail({ booking, subject, message }) {
  const resend = getResend();
  if (!resend || !process.env.EMAIL_FROM || !booking.email) return;
  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: booking.email,
    subject,
    html: `<h2>${subject}</h2>
      <p>${message}</p>
      <p><strong>Booking Ref:</strong> ${booking.booking_reference}</p>
      <p><strong>Artist:</strong> ${booking.artist_name}</p>
      <p><strong>Date:</strong> ${booking.booking_date}</p>
      <p><strong>Time:</strong> ${booking.booking_time}</p>
      <p><strong>Status:</strong> ${booking.status}</p>`
  });
}
