import { NextResponse } from "next/server";
import crypto from "crypto";
import { BOOKING_STATUSES, SLOT_STATUSES } from "../../../lib/constants";
import { getSupabaseServer } from "../../../lib/supabase-server";
import { sendAdminNotification, sendClientStatusEmail } from "../../../lib/email";

function createBookingReference() {
  return "INF-" + crypto.randomBytes(3).toString("hex").toUpperCase();
}
async function uploadPublicFile(supabase, file, folder) {
  if (!file) return null;
  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = file.name?.split(".").pop() || "jpg";
  const path = `${folder}/${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;
  const { error } = await supabase.storage.from("payment-proofs").upload(path, bytes, {
    contentType: file.type || "image/jpeg", upsert: false
  });
  if (error) throw error;
  const { data } = supabase.storage.from("payment-proofs").getPublicUrl(path);
  return data.publicUrl;
}
export async function POST(request) {
  try {
    const formData = await request.formData();
    const supabase = getSupabaseServer();
    const artist_name = String(formData.get("artist_name") || "");
    const service_name = String(formData.get("service_name") || "");
    const booking_date = String(formData.get("booking_date") || "");
    const booking_time = String(formData.get("booking_time") || "");
    const client_name = String(formData.get("client_name") || "");
    const mobile_number = String(formData.get("mobile_number") || "");
    const deposit_amount = Number(formData.get("deposit_amount") || 0);
    if (!artist_name || !service_name || !booking_date || !booking_time || !client_name || !mobile_number) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    const proofFile = formData.get("proof_of_payment");
    if (!proofFile || typeof proofFile === "string") {
      return NextResponse.json({ error: "Proof of payment is required." }, { status: 400 });
    }
    const { data: existingSlot } = await supabase.from("slots").select("*").eq("artist_name", artist_name).eq("slot_date", booking_date).eq("slot_time", booking_time).maybeSingle();
    if (existingSlot) return NextResponse.json({ error: "That slot is no longer available." }, { status: 409 });
    const reference_image = formData.get("reference_image");
    const proof_of_payment_url = await uploadPublicFile(supabase, proofFile, "proofs");
    const reference_image_url = reference_image && typeof reference_image !== "string" ? await uploadPublicFile(supabase, reference_image, "references") : null;
    const booking = {
      booking_reference: createBookingReference(),
      client_name, mobile_number,
      email: String(formData.get("email") || ""),
      social_handle: String(formData.get("social_handle") || ""),
      artist_name, service_name, booking_date, booking_time,
      placement: String(formData.get("placement") || ""),
      size: String(formData.get("size") || ""),
      budget: String(formData.get("budget") || ""),
      preferred_branch: String(formData.get("preferred_branch") || ""),
      design_description: String(formData.get("design_description") || ""),
      notes: String(formData.get("notes") || ""),
      reference_image_url, proof_of_payment_url,
      proof_reference_number: String(formData.get("proof_reference_number") || ""),
      payer_name: String(formData.get("payer_name") || ""),
      deposit_amount, status: BOOKING_STATUSES.PENDING_REVIEW
    };
    const { data: inserted, error: bookingError } = await supabase.from("bookings").insert(booking).select("*").single();
    if (bookingError) throw bookingError;
    const { error: slotError } = await supabase.from("slots").insert({
      artist_name, slot_date: booking_date, slot_time: booking_time, status: SLOT_STATUSES.HELD, booking_id: inserted.id, held_until: null
    });
    if (slotError) throw slotError;
    await supabase.from("audit_logs").insert({ booking_id: inserted.id, action: "Booking Submitted", action_by: "client", notes: "Booking submitted with proof of payment." });
    await sendAdminNotification(inserted);
    await sendClientStatusEmail({ booking: inserted, subject: `Booking Received - ${inserted.booking_reference}`, message: "Your booking was received and is now pending admin review." });
    return NextResponse.json({ booking: inserted });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to submit booking." }, { status: 500 });
  }
}
