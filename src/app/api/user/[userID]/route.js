import { redis } from "@/app/lib/redis";
import connectDB from "@/connection/mongodb";
import User from "@/models/userSchema";
import { cookies } from "next/headers";
import { NextResponse } from "next/server"


export async function GET(req, { params }) {
    try {

        await connectDB();

        const { userID } = params;

        let user = null;
        //check user in redis cache

        const cachedValue = await redis.get(userID);
        if (cachedValue) {
            user = JSON.parse(cachedValue);
        }
        else {
            user = await User.findOne({ _id: userID });
            if (!user) {
                return NextResponse.json({ message: "No User Found", status: "false" });
            }
            //set user in redis cache
            await redis.set(userID, JSON.stringify(user));
        }
        cookies().set('image', user.photo, {
            expires: new Date(Date.now() + 1200000)
        })

        return NextResponse.json({ user: user, message: "User Found", status: "true" });

    } catch (err) {
        return NextResponse.json({ message: "Server Error", status: "false" });
    }
}


export async function PUT(req, { params }) {
    try {
        await connectDB();
        const { userID } = params;
        const request = await req.json();
        if (!request.user.email || !request.user.name || !request.user.phone) {
            return NextResponse.json({ message: "Email, phone and name are required", status: "false" });
        }
        await redis.del("all-users")
        const updatedUser = await User.findByIdAndUpdate({ _id: userID }, request.user, { new: true });
        // set or update the value in cache
        await redis.set(userID, JSON.stringify(updatedUser));

        cookies().set('image', updatedUser.photo, {
            expires: new Date(Date.now() + 1200000)
        })

        return NextResponse.json({ message: "Details Updated Successfully", status: "true" });
    } catch (err) {
        return NextResponse.json({ message: "Server Error", status: "false" });
    }
}