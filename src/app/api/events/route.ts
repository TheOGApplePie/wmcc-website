import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    const start = req.nextUrl.searchParams.get("start");
    const end = req.nextUrl.searchParams.get("end");

    const { data: currentEvents } = await supabase
      .from("events")
      .select(
        "id, posterurl,posteralt,title,startdate, location, enddate, caption"
      )
      .gte("startdate", start)
      .lte("startdate", end);
    return NextResponse.json({ currentEvents });
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
