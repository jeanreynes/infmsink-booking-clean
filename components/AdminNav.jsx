export default function AdminNav() {
  return (
    <div className="nav mb-24">
      <a href="/admin" className="active">Dashboard</a>
      <a href="/admin/bookings">Bookings</a>
      <a href="/admin/calendar">Calendar</a>
      <a href="/admin/artists">Artists</a>
      <form action="/api/admin/logout" method="post" style={{ display: "inline" }}>
        <button type="submit" className="secondary">Logout</button>
      </form>
    </div>
  );
}
