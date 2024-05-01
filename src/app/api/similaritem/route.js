import connectDB from "@/utils/db";
import { NextResponse } from "next/server";
import SimilarItem from "@/model/SimilarItem";
import mongoose from "mongoose";

const checkConnection = async () => {
    if (mongoose.connections[0].readyState === 0) {
        try {
            await connectDB();
            console.log("DB Connected!");
        } catch (error) {
            console.log("DB Not Connected!", error);
        }
    } else {
        console.log("Database already connected to the server.");
    }
};

export const POST = async (req) => {
    try {
        checkConnection();
        const bodyData = await req.json();

        const itemName = bodyData.itemName.toUpperCase();
        const similarItem = bodyData.similarItem.toUpperCase();

        const item = await SimilarItem.findOne({
            itemName: itemName
        });

        let result = null

        if (item) {
            item.similarList.push({ itemName: similarItem });
            result = await item.save();
        } else {
            const payload = new SimilarItem({
                itemName: itemName,
                similarList: [{ itemName: itemName }, { itemName: similarItem }]
            });
            result = await payload.save();
        }

        if (result) {
            return NextResponse.json(
                { message: "Data saved successfully!" },
                { status: 200 }
            );
        } else {
            return NextResponse.json({ message: "Data not saved!" }, { status: 400 });
        }


    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Server failure" }, { status: 500 });
    }
};

export const GET = async () => {
    try {
        checkConnection();
        const result = await SimilarItem.find();
        if (result) {
            return NextResponse.json(result, { status: 200 });
        } else {
            return NextResponse.json({ message: "Data not found!" }, { status: 404 });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Server failure" }, { status: 500 });
    }
};


