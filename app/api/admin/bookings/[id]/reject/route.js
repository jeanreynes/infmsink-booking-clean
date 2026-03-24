import { NextResponse } from "next/server";
import { BOOKING_STATUSES } from "../../../../../../lib/constants";
import { getSupabaseServer } from "../../../../../../lib/supabase-server";
import { sendClientStatusEmail } from "../../../../../../lib/email";
import { isAdminAuthenticated } from "../../../../../../lib/session";

export async function POST(request, { params }) {
  try {
    const authed = await isAdminAuthenticated();
    if (!authed) return NextResponse.redirect(new URL("/admin/login", request.url));
    const supabase = getSupabaseServer();
    const { data: booking, error: bookingFetchError } = await supabase.from("bookings").select("*").eq("id", params.id).single();
    if (bookingFetchError || !booking) return NextResponse.redirect(new URL(`/admin/bookings/${params.id}?error=Booking not found`, request.url));
    const { error: bookingUpdateError } = await supabase.from("bookings").update({ status: BOOKING_STATUSES.REJECTED }).eq("id", params.id);
    if (bookingUpdateError) throw bookingUpdateError;
    const { error: slotDeleteError } = await supabase.from("slots").delete().eq("booking_id", params.id);
    if (slotDeleteError) throw slotDeleteError;
    await supabase.from("audit_logs").insert({ booking_id: params.id, action: "Booking Rejected", action_by: process.env.ADMIN_EMAIL, notes: "Slot reopened after rejection." });
    await sendClientStatusEmail({ booking: { ...booking, status: BOOKING_STATUSES.REJECTED }, subject: `Booking Update - ${booking.booking_reference}`, message: "Your booking was not approved. Please contact the shop if you need help." });
    return NextResponse.redirect(new URL(`/admin/bookings/${params.id}?success=Booking rejected`, request.url));
  } catch (error) {
    return NextResponse.redirect(new URL(`/admin/bookings/${params.id}?error=${encodeURIComponent(error.message || "Failed to reject")}`, request.url));
  }
}
