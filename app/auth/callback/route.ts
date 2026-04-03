import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  
  if (code) {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.exchangeCodeForSession(code);
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin + "/scan");
}
