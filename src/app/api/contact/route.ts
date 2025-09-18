import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const formData = await req.formData();
    const data = Object.fromEntries(formData);
    const insertionResponse = await supabase
      .from("community-feedback")
      .insert(data);
    return NextResponse.json(insertionResponse);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
