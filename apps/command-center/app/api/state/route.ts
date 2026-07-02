import { NextResponse, type NextRequest } from "next/server";
import { isAuthorized } from "@/lib/auth";
import { getCommandCenterState } from "@/lib/data";

export const dynamic = "force-dynamic";

// Protected read-only state endpoint. Returns operator dashboard data.
// No secrets are included in the payload.
export function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(getCommandCenterState());
}
