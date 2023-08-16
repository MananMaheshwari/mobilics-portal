import mongoose from 'mongoose'
import connectDB from "@/connection/mongodb";
import User from "@/models/userSchema"
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { redis } from '@/app/lib/redis';
export async function POST(req) {
    try {
        await connectDB();
        const request = await req.json()
        const salt = await bcrypt.genSalt(10);
        request.user.password = await bcrypt.hash(request.user.password, salt);
        const user = new User(request.user);
        await user.save();
        //delete all users from cache
        await redis.del("all-users");
        //set new user to cache
        await redis.set(user.email, JSON.stringify(user));

        return NextResponse.json({ message: 'User created successfully', status: "true" });
    } catch (err) {
        console.log("---------------")
        if (err instanceof mongoose.Error.ValidationError) {
            let errorList = [];
            for (let e in err.errors) {
                errorList.push(err.errors[e].message);
            }
            console.log(errorList);
            return NextResponse.json({ message: errorList[0], status: "false" })
        }
        else {
            return NextResponse.json({ message: "Unable to register you", status: "false" });
        }
    }
}

export async function GET(req) {
    try {
        await connectDB();
        let res = await redis.get("all-users");
        if (res) {
            return NextResponse.json({ users: JSON.parse(res) });
        }
        const users = await User.find({},);

        await redis.set("all-users", JSON.stringify(users));
        return NextResponse.json({ users })
    } catch (err) {
        return NextResponse.json({ message: "Server Error", status: "false" });
    }
}