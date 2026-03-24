import { redirect } from "next/navigation";
import AdminNav from "../../components/AdminNav";
import { isAdminAuthenticated } from "../../lib/session";
import { getSupabaseServer } from "../../lib/supabase-server";
import { BOOKING_STATUSES } from "../../lib/constants";

export default async function AdminDashboardPage() {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin/login");
  const supabase = getSupabaseServer();
  const { data: pending } = await supabase.from("bookings").select("*").eq("status", BOOKING_STATUSES.PENDING_REVIEW).order("created_at",{ascending:false});
  const { data: confirmed } = await supabase.from("bookings").select("*").eq("status", BOOKING_STATUSES.CONFIRMED).order("created_at",{ascending:false});
  const { data: today } = await supabase.from("bookings").select("*").eq("booking_date", new Date().toISOString().slice(0,10));
  const depositTotal = (pending || []).concat(confirmed || []).reduce((sum,row)=>sum+Number(row.deposit_amount||0),0);

  return (
    <div className="container">
      <div className="space-between">
        <div>
          <p className="kicker">Admin dashboard</p>
          <h1 className="h1">INFMSINK Booking Admin</h1>
          <p className="muted">Review new submissions and confirm slots.</p>
        </div>
      </div>
      <AdminNav />
      <div className="stats mb-24">
        <div className="card p-20"><div className="muted">Pending Review</div><div className="statNumber">{pending?.length || 0}</div></div>
        <div className="card p-20"><div className="muted">Confirmed Bookings</div><div className="statNumber">{confirmed?.length || 0}</div></div>
        <div className="card p-20"><div className="muted">Today's Appointments</div><div className="statNumber">{today?.length || 0}</div></div>
        <div className="card p-20"><div className="muted">Deposits Submitted</div><div className="statNumber">₱{depositTotal.toLocaleString()}</div></div>
      </div>
      <div className="card p-24">
        <div className="space-between mb-16">
          <h2 className="h2">Latest pending bookings</h2>
          <a href="/admin/bookings" className="button secondary">View all</a>
        </div>
        <div className="tableWrap">
          <table>
            <thead><tr><th>Ref</th><th>Client</th><th>Artist</th><th>Service</th><th>Date</th><th>Time</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {(pending || []).map((b)=>(
                <tr key={b.id}>
                  <td>{b.booking_reference}</td><td>{b.client_name}</td><td>{b.artist_name}</td><td>{b.service_name}</td><td>{b.booking_date}</td><td>{b.booking_time}</td>
                  <td><span className="badge">{b.status}</span></td>
                  <td><a href={`/admin/bookings/${b.id}`} className="button secondary">Review</a></td>
                </tr>
              ))}
              {(!pending || pending.length===0) ? <tr><td colSpan="8" className="muted">No pending bookings.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
