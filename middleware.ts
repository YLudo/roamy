import { get } from "@vercel/edge-config";
import { NextRequest, NextResponse } from "next/server";

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)'
    ]
}

export async function middleware(request: NextRequest) {
    const isInMaintenanceMode = await get('maintenance');

    if (isInMaintenanceMode) {
        request.nextUrl.pathname = `/maintenance`;
        return NextResponse.rewrite(request.nextUrl);
    }
}