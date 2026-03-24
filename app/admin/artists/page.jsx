import { redirect } from "next/navigation";
import AdminNav from "../../../components/AdminNav";
import { isAdminAuthenticated } from "../../../lib/session";
import { getSupabaseServer } from "../../../lib/supabase-server";
import { ARTISTS } from "../../../lib/constants";

export default async function AdminArtistsPage() {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin/login");
  const supabase = getSupabaseServer();
  const { data: bookings } = await supabase.from("bookings").select("artist_name,status,booking_date,booking_time");
  const rows = ARTISTS.map((artist)=>{
    const artistBookings = (bookings || []).filter((row)=>row.artist_name===artist);
    const confirmed = artistBookings.filter((row)=>row.status==="Confirmed").length;
    const pending = artistBookings.filter((row)=>row.status==="Pending Review").length;
    const nextSlot = artistBookings.filter((row)=>row.status==="Confirmed").sort((a,b)=>`${a.booking_date} ${a.booking_time}`.localeCompare(`${b.booking_date} ${b.booking_time}`))[0];
    return { artist, total: artistBookings.length, confirmed, pending, next: nextSlot ? `${nextSlot.booking_date} ${nextSlot.booking_time}` : "Open" };
  });
  return (
    <div className="container">
      <p className="kicker">Admin</p>
      <h1 className="h1">Artists overview</h1>
      <AdminNav />
      <div className="grid grid-3">
        {rows.map((row)=>(
          <div className="card p-20" key={row.artist}>
            <div className="h3">{row.artist}</div>
            <p><strong>Total bookings:</strong> {row.total}</p>
            <p><strong>Pending review:</strong> {row.pending}</p>
            <p><strong>Confirmed:</strong> {row.confirmed}</p>
            <p><strong>Next confirmed slot:</strong> {row.next}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
