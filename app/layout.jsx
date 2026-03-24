import "./globals.css";
export const metadata = {
  title: "INFMSINK Booking",
  description: "INFMSINK booking and admin review system"
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
