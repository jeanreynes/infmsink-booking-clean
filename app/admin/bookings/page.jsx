import { redirect } from "next/navigation";
import AdminNav from "../../../components/AdminNav";
import { isAdminAuthenticated } from "../../../lib/session";
import { getSupabaseServer } from "../../../lib/supabase-server";

export default async function AdminBookingsPage() {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin/login");
  const supabase = getSupabaseServer();
  const { data: bookings } = await supabase.from("bookings").select("*").order("created_at",{ascending:false});
  return (
    <div className="container">
      <p className="kicker">Admin</p>
      <h1 className="h1">All bookings</h1>
      <AdminNav />
      <div className="card p-24">
        <div className="tableWrap">
          <table>
            <thead><tr><th>Ref</th><th>Client</th><th>Artist</th><th>Service</th><th>Date</th><th>Time</th><th>Deposit</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {(bookings || []).map((b)=>(
                <tr key={b.id}>
                  <td>{b.booking_reference}</td><td>{b.client_name}</td><td>{b.artist_name}</td><td>{b.service_name}</td><td>{b.booking_date}</td><td>{b.booking_time}</td>
                  <td>₱{Number(b.deposit_amount || 0).toLocaleString()}</td><td><span className="badge">{b.status}</span></td>
                  <td><a href={`/admin/bookings/${b.id}`} className="button secondary">Open</a></td>
                </tr>
              ))}
              {(!bookings || bookings.length===0) ? <tr><td colSpan="9" className="muted">No bookings yet.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
