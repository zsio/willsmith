import mongoose, { Document, Schema, Model, models, model } from "mongoose";

interface IRuntimeCpu {
  time: {
    sys: number;
    user: number;
  };
  ctx_switches: {
    voluntary: number;
    involuntary: number;
  };
  percent: number;
}

interface IRuntime {
  sdk: string;
  sdk_version: string;
  library: string;
  platform: string;
  runtime: string;
  py_implementation: string;
  runtime_version: string;
  langchain_version: string;
  langchain_core_version: string;
  thread_count: number;
  mem: {
    rss: number;
  };
  cpu: IRuntimeCpu;
  library_version: string;
}

interface IExtra {
  runtime: IRuntime;
  metadata: {
    revision_id: string;
  };
}

interface IEvent {
  name: string;
  time: Date;
}

export interface IRun extends Document {
  id: string;
  start_time: Date;
  end_time: Date | null;
  extra: IExtra;
  error: any;
  serialized: any;
  events: IEvent[];
  reference_example_id: string | null;
  parent_run_id: string | null;
  tags: string[];
  trace_id: string;
  dotted_order: string;
  outputs: any;
  session_name: string;
  name: string;
  inputs: any;
  run_type: string;
  type: string;
  createdAt: Date;
}

const RuntimeCpuSchema = new Schema<IRuntimeCpu>({
  time: {
    sys: Number,
    user: Number,
  },
  ctx_switches: {
    voluntary: Number,
    involuntary: Number,
  },
  percent: Number,
});

const RuntimeSchema = new Schema<IRuntime>({
  sdk: String,
  sdk_version: String,
  library: String,
  platform: String,
  runtime: String,
  py_implementation: String,
  runtime_version: String,
  langchain_version: String,
  langchain_core_version: String,
  thread_count: Number,
  mem: {
    rss: Number,
  },
  cpu: RuntimeCpuSchema,
  library_version: String,
});

const ExtraSchema = new Schema<IExtra>({
  runtime: RuntimeSchema,
  metadata: {
    revision_id: String,
  },
});

const EventSchema = new Schema<IEvent>({
  name: String,
  time: Date,
});

const RunSchema = new Schema<IRun>(
  {
    id: { type: String, required: true, unique: true },
    start_time: Date,
    end_time: Date,
    extra: ExtraSchema,
    error: Schema.Types.Mixed,
    serialized: Schema.Types.Mixed,
    events: [EventSchema],
    reference_example_id: String,
    parent_run_id: String,
    tags: [String],
    trace_id: String,
    dotted_order: String,
    outputs: Schema.Types.Mixed,
    session_name: String,
    name: String,
    inputs: Schema.Types.Mixed,
    run_type: String,
    type: String,
    createdAt: Date,
  },
  {
    timestamps: true,
    collection: "runs",
  }
);

// const UserModel: Model<UserDocument> = models.User || model<UserDocument>("User", userSchema);
// const Run = (mongoose.models.Runs as Model<IRun>) || mongoose.model<IRun>('Runs', RunSchema);

const RunModel: Model<IRun> = models.Runs || model<IRun>("Runs", RunSchema);

export default RunModel;
