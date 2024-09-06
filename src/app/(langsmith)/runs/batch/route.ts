
import { headers } from 'next/headers'
import clientPromise, {getConnection} from "@/lib/mongo/mongo";
import mongoose from "mongoose";

export async function POST(request: Request) {
    const connection = await getConnection()
    const res = await request.json()


    const postList = res.post || [];
    const patchList = res.patch || [];

    const documents = res.patch || res.post || [];

    const documentsWithTimestamp = documents.map((doc: Object) => ({
        ...doc,
        type: 'patch' in res ? 'patch' : 'post',
        createdAt: new Date(),
        session_name: res.session_name || "default"
      }));


    await connection.collection("runs").insertMany(documentsWithTimestamp)

    return Response.json({
        "message": "Runs batch ingested",
        "dbId": connection.id
    }, {
        status: 202
    })
}