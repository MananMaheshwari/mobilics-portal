
import connectDB from "@/connection/mongodb";
import User from "@/models/userSchema";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { redis } from "@/app/lib/redis";
const jwt = require('jsonwebtoken');

//comment
export async function POST(req) {
    console.log("post request for login")
    try {
        await connectDB();
        const { user } = await req.json();
        console.log("user at route: ", user);
        if (!user.email || !user.password) {
            return NextResponse.json({ error: "Fill all the fields" });
        }

        let userLogin = null;

        const cachedValue = await redis.get(user.email);

        if (cachedValue) {
            userLogin = JSON.parse(cachedValue);
            console.log("cache memory found: ", userLogin);
        }
        else {
            console.log("call to database");
            userLogin = await User.findOne({ email: user.email });
            if (!userLogin) {
                return NextResponse.json({ message: "No user found", status: "false" });
            }
            userLogin && redis.set(user.email, JSON.stringify(userLogin));

        }
        if (userLogin) {
            const isMatch = await bcrypt.compare(user.password, userLogin.password);

            if (isMatch) {
                console.log("password is okay");
                const token = jwt.sign({ _id: userLogin._id, name: userLogin.name, email: userLogin.email }, process.env.SECRET_KEY);

                console.log("token is: ", token);
                cookies().set("jwtoken", token, {
                    expires: new Date(Date.now() + 1200000),
                    // httpOnly: true
                });
                cookies().set("image", userLogin.photo, {
                    expires: new Date(Date.now() + 1200000),
                })
                console.log("reaching end");
                const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
                return NextResponse.json({ id: verifyToken._id, message: "User Login Successful", status: "true" });
            }
            else {
                return NextResponse.json({ message: "Wrong Password", status: "false" });
            }
        }
        else {
            return NextResponse.json({ message: "No User Found", status: "false" });
        }

    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: "Server Error...", status: "false" });
    }
}