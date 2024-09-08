import mongoose, { ConnectOptions, Mongoose } from "mongoose";
import { PHASE_PRODUCTION_BUILD } from 'next/constants';

let mongoDBClientPromise: Promise<Mongoose>;

// 检查是否是构建阶段
const isBuildPhase = process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;

if (!isBuildPhase) {  // 只有在非构建阶段执行连接逻辑
  if (!process.env.MONGODB_URI) {
    throw new Error('没有找到环境变量: "MONGODB_URI"');
  }

  const uri = process.env.MONGODB_URI;
  const options = {};

  if (process.env.NODE_ENV === "development") {
    let globalMongo = global as typeof globalThis & {
      isConnected?: Promise<Mongoose>;
    };

    if (!globalMongo.isConnected) {
      globalMongo.isConnected = mongoose.connect(uri, options as ConnectOptions);
    }

    mongoDBClientPromise = globalMongo.isConnected;
  } else {
    mongoDBClientPromise = mongoose.connect(uri, options as ConnectOptions);
  }
}

// @ts-ignore
export default mongoDBClientPromise;
export const getMongoDBConnection = async () => {
  if (!mongoDBClientPromise) throw new Error("MongoDB 连接不可用");
  return (await mongoDBClientPromise).connection;
};