import { NextRequest, NextResponse } from "next/server";
import { ResponseCodes } from "../../enums/responseCodes";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      }
    );
    const verification = await response.json();
    if (!process.env.RECAPTCHA_SECRET_KEY) {
      return NextResponse.json(
        { success: false, error: "Server misconfiguration" },
        { status: ResponseCodes.SERVER_ERROR }
      );
    }
    if (!verification?.success) {
      return NextResponse.json(
        { success: false, error: "Invalid captcha" },
        { status: ResponseCodes.CLIENT_ERROR }
      );
    }
    return NextResponse.json({
      success: true,
      score: verification.score,
      action: verification.action,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "There was something wrong while validating the captcha" },
      { status: ResponseCodes.SERVER_ERROR }
    );
  }
}
