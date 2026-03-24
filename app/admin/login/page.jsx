export default async function AdminLoginPage({ searchParams }) {
  const sp = await searchParams;
  return (
    <div className="container">
      <div className="card p-24" style={{ maxWidth: 480, margin: "60px auto" }}>
        <p className="kicker">Admin only</p>
        <h1 className="h1">INFMSINK Admin Login</h1>
        <p className="muted mb-24">Use your admin credentials to review booking submissions.</p>
        {sp?.error ? <div className="error mb-16">Invalid email or password.</div> : null}
        <form action="/api/admin/login" method="post">
          <div className="mb-16"><label>Email</label><input name="email" type="email" required /></div>
          <div className="mb-16"><label>Password</label><input name="password" type="password" required /></div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
