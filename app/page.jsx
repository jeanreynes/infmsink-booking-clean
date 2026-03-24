import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <div style={{ textAlign: "center" }}>
        <img src="/logo.png" style={{ width: 180 }} />
        <br /><br />
        <Link href="/book">Book Now</Link>
      </div>
    </main>
  );
}
