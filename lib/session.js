import crypto from "crypto";
import { cookies } from "next/headers";
const COOKIE_NAME = "infmsink_admin_session";
function sign(value) {
  const secret = process.env.ADMIN_PASSWORD || "change-me";
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}
export async function createAdminSession() {
  const cookieStore = await cookies();
  const value = "admin";
  cookieStore.set(COOKIE_NAME, `${value}.${sign(value)}`, {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", path: "/", maxAge: 60 * 60 * 12
  });
}
export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", path: "/", maxAge: 0
  });
}
export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return false;
  const [value, signature] = raw.split(".");
  return value === "admin" && signature === sign(value);
}
