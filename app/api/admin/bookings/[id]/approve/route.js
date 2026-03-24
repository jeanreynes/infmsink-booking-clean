import { NextResponse } from "next/server";
import { BOOKING_STATUSES, SLOT_STATUSES } from "../../../../../../lib/constants";
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
    const { error: bookingUpdateError } = await supabase.from("bookings").update({
      status: BOOKING_STATUSES.CONFIRMED, approved_at: new Date().toISOString(), approved_by: process.env.ADMIN_EMAIL
    }).eq("id", params.id);
    if (bookingUpdateError) throw bookingUpdateError;
    const { error: slotUpdateError } = await supabase.from("slots").update({ status: SLOT_STATUSES.BLOCKED }).eq("booking_id", params.id);
    if (slotUpdateError) throw slotUpdateError;
    await supabase.from("audit_logs").insert({ booking_id: params.id, action: "Booking Approved", action_by: process.env.ADMIN_EMAIL, notes: "Slot blocked and booking confirmed." });
    await sendClientStatusEmail({ booking: { ...booking, status: BOOKING_STATUSES.CONFIRMED }, subject: `Booking Confirmed - ${booking.booking_reference}`, message: "Your booking has been approved and your selected slot is now confirmed." });
    return NextResponse.redirect(new URL(`/admin/bookings/${params.id}?success=Booking approved`, request.url));
  } catch (error) {
    return NextResponse.redirect(new URL(`/admin/bookings/${params.id}?error=${encodeURIComponent(error.message || "Failed to approve")}`, request.url));
  }
}
