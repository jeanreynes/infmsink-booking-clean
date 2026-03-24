import { redirect } from "next/navigation";
import AdminNav from "../../../components/AdminNav";
import { isAdminAuthenticated } from "../../../lib/session";
import { getSupabaseServer } from "../../../lib/supabase-server";

export default async function AdminCalendarPage() {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin/login");
  const supabase = getSupabaseServer();
  const { data: bookings } = await supabase.from("bookings").select("*").eq("status","Confirmed").order("booking_date",{ascending:true}).order("booking_time",{ascending:true});
  return (
    <div className="container">
      <p className="kicker">Admin</p>
      <h1 className="h1">Confirmed calendar</h1>
      <AdminNav />
      <div className="grid grid-3">
        {(bookings || []).map((b)=>(
          <div className="card p-20" key={b.id}>
            <div className="badge">{b.artist_name}</div>
            <h3 className="h3" style={{marginTop:12}}>{b.client_name}</h3>
            <p className="muted">{b.service_name}</p>
            <p><strong>Date:</strong> {b.booking_date}</p>
            <p><strong>Time:</strong> {b.booking_time}</p>
            <p><strong>Ref:</strong> {b.booking_reference}</p>
          </div>
        ))}
        {(!bookings || bookings.length===0) ? <div className="muted">No confirmed bookings yet.</div> : null}
      </div>
    </div>
  );
}
