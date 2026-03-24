import { redirect } from "next/navigation";
import AdminNav from "../../../../components/AdminNav";
import { isAdminAuthenticated } from "../../../../lib/session";
import { getSupabaseServer } from "../../../../lib/supabase-server";
import { BOOKING_STATUSES } from "../../../../lib/constants";

export default async function AdminBookingDetailPage({ params, searchParams }) {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin/login");
  const supabase = getSupabaseServer();
  const { data: booking } = await supabase.from("bookings").select("*").eq("id", params.id).single();
  const sp = await searchParams;
  if (!booking) return <div className="container"><div className="error">Booking not found.</div></div>;

  return (
    <div className="container">
      <p className="kicker">Admin booking review</p>
      <h1 className="h1">Review {booking.booking_reference}</h1>
      <AdminNav />
      {sp?.success ? <div className="success mb-16">{sp.success}</div> : null}
      {sp?.error ? <div className="error mb-16">{sp.error}</div> : null}
      <div className="grid grid-2">
        <div className="card p-24">
          <h2 className="h2">Client details</h2>
          <p><strong>Name:</strong> {booking.client_name}</p>
          <p><strong>Mobile:</strong> {booking.mobile_number}</p>
          <p><strong>Email:</strong> {booking.email || "-"}</p>
          <p><strong>Social:</strong> {booking.social_handle || "-"}</p>
          <p><strong>Artist:</strong> {booking.artist_name}</p>
          <p><strong>Service:</strong> {booking.service_name}</p>
          <p><strong>Date:</strong> {booking.booking_date}</p>
          <p><strong>Time:</strong> {booking.booking_time}</p>
          <p><strong>Branch:</strong> {booking.preferred_branch || "-"}</p>
          <p><strong>Status:</strong> <span className="badge">{booking.status}</span></p>
          <p><strong>Deposit:</strong> ₱{Number(booking.deposit_amount||0).toLocaleString()}</p>
          <p><strong>Placement:</strong> {booking.placement || "-"}</p>
          <p><strong>Size:</strong> {booking.size || "-"}</p>
          <p><strong>Budget:</strong> {booking.budget || "-"}</p>
          <p><strong>Design Description:</strong> {booking.design_description || "-"}</p>
          <p><strong>Notes:</strong> {booking.notes || "-"}</p>
          <p><strong>Payer Name:</strong> {booking.payer_name || "-"}</p>
          <p><strong>Proof Ref:</strong> {booking.proof_reference_number || "-"}</p>
        </div>
        <div className="card p-24">
          <h2 className="h2">Uploads</h2>
          <div className="mb-24">
            <p className="h3">Proof of payment</p>
            {booking.proof_of_payment_url ? <img src={booking.proof_of_payment_url} alt="Proof of payment" style={{width:"100%",borderRadius:16,border:"1px solid #e5e7eb"}} /> : <p className="muted">No proof uploaded.</p>}
          </div>
          <div className="mb-24">
            <p className="h3">Reference image</p>
            {booking.reference_image_url ? <img src={booking.reference_image_url} alt="Reference" style={{width:"100%",borderRadius:16,border:"1px solid #e5e7eb"}} /> : <p className="muted">No reference uploaded.</p>}
          </div>
          {booking.status === BOOKING_STATUSES.PENDING_REVIEW ? <div className="row">
            <form action={`/api/admin/bookings/${booking.id}/approve`} method="post"><button type="submit">Approve booking</button></form>
            <form action={`/api/admin/bookings/${booking.id}/reject`} method="post"><button type="submit" className="secondary">Reject booking</button></form>
          </div> : null}
        </div>
      </div>
    </div>
  );
}
