import { db } from "@/firebase";
import { FileType } from "@/typings";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const docResults = await getDocs(collection(db, "users", userId, "files"));
        
        const files: FileType[] = docResults.docs.map((doc) => ({
            id: doc.id,
            filename: doc.data().filename || doc.id,
            timestamp: new Date(doc.data().timestamp?.seconds * 1000) || undefined,
            fullName: doc.data().fullName,
            downloadURL: doc.data().downloadURL,
            type: doc.data().type,
            size: doc.data().size,
        }));

        return NextResponse.json(files);
    } catch (error) {
        console.error("Error in /api/files:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
