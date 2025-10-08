import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";
import { ContactForm } from "../../schemas/contactForm";
import { ResponseCodes } from "../../enums/responseCodes";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();
    const result = ContactForm.safeParse(formData);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: ResponseCodes.CLIENT_ERROR }
      );
    }
    const supabase = await createClient();
    const insertionResponse = await supabase
      .from("community-feedback")
      .insert(formData);
    return NextResponse.json(insertionResponse);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "There was something wrong while submitting your request" },
      { status: ResponseCodes.SERVER_ERROR }
    );
  }
}
