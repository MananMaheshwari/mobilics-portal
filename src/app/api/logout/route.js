import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export function GET(req) {
    cookies().set("jwtoken", "", {
        expires: new Date(0)
    });
    cookies().set("image", "", {
        expires: new Date(0)
    })
    return NextResponse.json({ message: "Logged Out!", status: "true" });
}