"use server";

import { ObjectId } from "mongodb";
import mongoDBClientPromise, { getMongoDBConnection } from "@/lib/mongo/mongo";
import { IRun, default as RunModel } from "@/models/runs";

export async function getProjectsAction() {
  const connection = (await getMongoDBConnection()).collection("runs");

  const projects = await connection.aggregate([
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
  ]).toArray();
  return projects?.[0] || [];
}

export async function getRunsAction(
  session_name: string,
  limit: number = 50,
  last_id?: string
): Promise<IRun[]> {
  await mongoDBClientPromise;

  // 基础查询条件
  let query: any = {
    session_name,
    parent_run_id: null,
    type: "post"
  };

  // 使用 _id 进行分页
  if (last_id) {
    query._id = { $lt: new ObjectId(last_id) };
  }

  // 只选择需要的字段
  const projection = {
    _id: 1,
    id: 1,
    start_time: 1,
    end_time: 1,
    name: 1,
    run_type: 1,
    inputs: 1,
    outputs: 1,
    type: 1,
  };

  try {
    const runs = await RunModel.find(query, projection)
      .sort({ _id: -1 })
      .limit(limit)
      .lean();
    
    const runIds = runs.map((run) => run.id)
    const newRuns = (await getRunActionByIds(runIds, true))
    const patchList =  runs.map((run) => {
      const newRun = newRuns.find((newRun) => newRun.id === run.id)
      if (newRun) {
        run.name = run.name
        run.inputs = newRun.inputs
        run.outputs = newRun.outputs
        run.type = run.type || newRun.type
        run.start_time = run.start_time || newRun.start_time
        run.end_time = run.end_time || newRun.end_time
      }
      return run
    })

    return patchList.map((run) => ({
      ...run,
      _id: run._id.toString(),
    }));
  } catch (error) {
    console.error("Error fetching runs:", error);
    return [];
  }
}

export async function getRunActionByIds(runIds: string[], isPatch: boolean = false) {
    await mongoDBClientPromise;
    const runs = await RunModel.find({ 
        id: { $in: runIds },
        type: isPatch ? "patch" : "run"
    }).lean()
    return runs.map((run) => ({
      ...run,
      _id: run._id.toString(),
    }))
}
