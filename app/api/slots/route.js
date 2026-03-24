import { NextResponse } from "next/server";
import { DEFAULT_SLOTS, SLOT_STATUSES } from "../../../lib/constants";
import { getSupabaseServer } from "../../../lib/supabase-server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const artist_name = searchParams.get("artist_name");
    const date = searchParams.get("date");
    if (!artist_name || !date) return NextResponse.json({ error: "artist_name and date are required" }, { status: 400 });
    const supabase = getSupabaseServer();
    const { data: takenSlots, error } = await supabase.from("slots").select("slot_time,status").eq("artist_name", artist_name).eq("slot_date", date).in("status", [SLOT_STATUSES.HELD, SLOT_STATUSES.BLOCKED]);
    if (error) throw error;
    const taken = new Set((takenSlots || []).map((row)=>row.slot_time));
    const available = DEFAULT_SLOTS.filter((slot)=>!taken.has(slot));
    return NextResponse.json({ slots: available });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to load slots" }, { status: 500 });
  }
}
