import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#fff",
        padding: "24px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          width: "100%",
          maxWidth: "420px",
        }}
      >
        <div style={{ marginBottom: "24px" }}>
          <img
            src="/logo.png"
            alt="INFMSINK Logo"
            style={{
              width: "180px",
              maxWidth: "100%",
              height: "auto",
              objectFit: "contain",
              margin: "0 auto",
              display: "block",
            }}
          />
        </div>

        <Link
          href="/book"
          style={{
            display: "inline-block",
            width: "100%",
            padding: "16px 20px",
            borderRadius: "14px",
            background: "#111827",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700,
            fontSize: "16px",
          }}
        >
          Book Now
        </Link>
      </div>
    </main>
  );
}
