"use server";

const { ObjectId } = require('mongodb');
import { getConnection } from "@/lib/mongo/mongo";

export async function getProjectsAction() {
  const connection = await getConnection();
  const collection = connection.collection("runs");

  const projects = await collection
    .aggregate([
      {
        $group: {
          _id: "$session_name",
          count: { $sum: 1 },
          first_create_time: { $min: "$createdAt" },
          last_create_time: { $max: "$createdAt" },
        },
      },
      {
        $project: {
          _id: 0,
          session_name: "$_id",
          count: 1,
          first_create_time: 1,
          last_create_time: 1,
        },
      },
      {
        $group: {
          _id: null,
          total_count: { $sum: 1 },
          sessions: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          total_count: 1,
          sessions: 1,
        },
      },
    ])
    .toArray();
  return projects[0];
}

export async function getRunsAction(
    session_name: string,
    limit: number = 30,
    last_id?: string
  ) {
    const connection = await getConnection();
    const collection = connection.collection("runs");
  
    let query: any = {
      session_name,
      parent_run_id: null,
    };
  
    let sort: any = { start_time: -1 };
  
    if (last_id) {
      const lastRun = await collection.findOne({ _id: new ObjectId(last_id) });
      if (lastRun) {
        query.start_time = { $lt: lastRun.start_time };
      } else {
        // 如果找不到对应的 last_id，则返回空数组
        return [];
      }
    }
  
    const runs = await collection
      .find(query)
      .sort(sort)
      .limit(limit)
      .hint({ session_name: 1, parent_run_id: 1, start_time: -1 })
      .toArray();
  
    return runs || [];
  }