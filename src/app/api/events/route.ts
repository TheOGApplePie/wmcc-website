import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();

  const start = req.nextUrl.searchParams.get("start");
  const end = req.nextUrl.searchParams.get("end");

  const { data: currentEvents } = await supabase
    .from("events")
    .select(
      "id, poster_url,poster_alt,title,start_date, location, end_date, description",
    )
    .gte("start_date", start)
    .lte("start_date", end);
  return NextResponse.json({ currentEvents });
}
