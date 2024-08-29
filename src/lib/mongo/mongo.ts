
import mongoose, { ConnectOptions, Mongoose } from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error('没有找到环境变量: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

const options = {};

let clientPromise: Promise<Mongoose>;

if (process.env.NODE_ENV === "development") {
  // 在开发模式下，使用一个全局变量，HMR 时不会重新连接
  let globalMongo = global as typeof globalThis & {
    isConnected?: Promise<Mongoose>;
  };

  if (!globalMongo.isConnected) {
    globalMongo.isConnected = mongoose.connect(uri, options as ConnectOptions);
  }

  clientPromise = globalMongo.isConnected;
} else {
  // 生产环境最好不使用全局变量
  try {
    clientPromise = mongoose.connect(uri, options as ConnectOptions);
  } catch (err) {
    console.log(err);
  }
  clientPromise = mongoose.connect(uri, options as ConnectOptions);
}


// 导出一个模块作用域的 MongoClient promise。通过在
// 单独的模块中执行此操作，客户端可以在多个函数间共享。

export default clientPromise;

export const getConnection = async () => (await clientPromise).connection;