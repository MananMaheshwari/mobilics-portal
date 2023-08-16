import mongoose from 'mongoose';
import connectDB from "@/connection/mongodb";
import User from "@/models/userSchema";
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    try {
        await connectDB();
        const { userID } = params;
        const result = await User.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(userID) }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'connections',
                    foreignField: '_id',
                    as: 'connectedUsers'
                }
            }
        ]);

        console.log("result: ", result[0]);
        return NextResponse.json({ result: result[0] })
    } catch (err) {
        console.log(err);
    }
}