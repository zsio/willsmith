import { headers } from "next/headers";
import mongoDBClientPromise, { getMongoDBConnection } from "@/lib/mongo/mongo";
import { IRun } from "@/models/runs";

import { BulkJobOptions, Queue, tryCatch } from "bullmq";

const runsQueue = new Queue("runs_queue", {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env?.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD,
    db: 2,
  },
});

// await addJobs();

interface Job {
  name: string;
  data: any;
  opts?: BulkJobOptions;
}

export async function POST(request: Request) {
  try {
    const res = await request.json();

    const postList = res.post || [];
    const patchList = res.patch || [];

    if (postList.length) {
      const posts: Job[] = postList.map((doc: IRun) => {
        const item = {
          name: doc.name,
          data: {
            ...doc,
            type: "post",
            serverCreatedAt: new Date(),
          },
          opts: {
            priority: 10,
          },
        };
        return item;
      });
      const jobs = await runsQueue.addBulk(posts);
    }

    if (patchList.length) {
      const patches: Job[] = patchList.map((doc: IRun) => {
        const item = {
          name: doc.name,
          data: {
            ...doc,
            type: "patch",
            serverCreatedAt: new Date(),
          },
          opts: {
            priority: 20,
          },
        };
        return item;
      });
      const jobs = await runsQueue.addBulk(patches);
    }
  } catch (error) {
  } finally {
    return Response.json(
      {
        message: "Runs batch ingested",
      },
      {
        status: 202,
      }
    );
  }

  // const connection = await getMongoDBConnection()

  // const documents = res.patch || res.post || [];

  // const documentsWithTimestamp = documents.map((doc: IRun) => {
  //     return {
  //         ...doc,
  //         type: 'patch' in res ? 'patch' : 'post',
  //         createdAt: new Date(),
  //         session_name: doc?.session_name || "default"
  //     }
  // });

  // await connection.collection("runs").insertMany(documentsWithTimestamp)
}
