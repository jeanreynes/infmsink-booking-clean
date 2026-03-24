import { NextResponse } from "next/server";
import { createAdminSession } from "../../../../lib/session";
export async function POST(request) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    await createAdminSession();
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return NextResponse.redirect(new URL("/admin/login?error=1", request.url));
}
