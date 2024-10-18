
import { headers } from 'next/headers'
import mongoDBClientPromise, { getMongoDBConnection } from "@/lib/mongo/mongo";
import { IRun } from '@/models/runs';

export async function POST(request: Request) {
    const connection = await getMongoDBConnection()
    const res = await request.json()


    const postList = res.post || [];
    const patchList = res.patch || [];

    const documents = res.patch || res.post || [];

    const documentsWithTimestamp = documents.map((doc: IRun) => ({
        ...doc,
        type: 'patch' in res ? 'patch' : 'post',
        createdAt: new Date(),
        session_name: doc?.session_name || "default"
      }));


    await connection.collection("runs").insertMany(documentsWithTimestamp)

    return Response.json({
        "message": "Runs batch ingested",
    }, {
        status: 202
    })
}