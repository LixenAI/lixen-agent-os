import { NextResponse } from "next/server";
import { getCommandCenterState } from "@/lib/data";
import { isAuthorized } from "@lixen/auth";

export async function GET(request: Request) {
  if (!isAuthorized(request as any)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const state = getCommandCenterState();
  return NextResponse.json(state);
}
