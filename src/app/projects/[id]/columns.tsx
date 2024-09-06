"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
const ReactJsonView = dynamic(() => import("react-json-view"), { ssr: false });

import type { IRun } from "@/models/runs";
import { CircleCheck, CircleX } from "lucide-react";
import dynamic from "next/dynamic";
import dayjs from "dayjs";

const copyToClipboard = (text: Object) => {
  navigator.clipboard.writeText(JSON.stringify(text, null, 2));
};


function getSingleStringProperty(obj: Record<string, any>) {
    const keys = Object.keys(obj);
    // 检查对象是否只有一个键
    if (keys.length !== 1) {
      return JSON.stringify(obj);
    }
    const key = keys[0];
    const value = obj[key];
    if (typeof value === 'string') {
      return value;
    }
    return JSON.stringify(value);
  }


export const columns: ColumnDef<IRun>[] = [
  {
    accessorKey: "error",
    header: () => <div className="text-sm text-muted-foreground max-w-12 text-center">Status</div>,
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground text-center">
        {row.original.error ? (
          <CircleX color="#ff0000" />
        ) : (
          <CircleCheck color="#199400" />
        )}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    size: 200,
    cell: ({ row }) => <div>
        <div className="truncate hover:underline cursor-pointer">{row.original.name}</div>
        <div className="text-muted-foreground text-sm">{row.original.id}</div>
    </div>,
  },
  {
    accessorKey: "run_type",
    header: "Type",
  },
  {
    accessorKey: "inputs",
    header: "Inputs",
    cell: ({ row }) => (
      <Dialog>
        <DialogTrigger>
          <div className="max-w-[200px] truncate hover:underline cursor-pointer">
            {getSingleStringProperty(row.original.inputs)}
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-[70vw]">
          <DialogHeader>
            <DialogTitle className="text-lg">Inputs</DialogTitle>
            <DialogDescription>{row.original.name}</DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] h-[50vh] overflow-y-auto">
            <ReactJsonView
              src={row.original.inputs || {}}
              collapsed={2}
              iconStyle="circle"
              enableClipboard={({ src }) => copyToClipboard(src)}
            />
          </div>
        </DialogContent>
      </Dialog>
    ),
  },
  {
    accessorKey: "outputs",
    header: "Outputs",
    cell: ({ row }) => (
      <Dialog>
        <DialogTrigger>
          <div className="max-w-[200px] truncate hover:underline cursor-pointer">
            {getSingleStringProperty(row.original.outputs)}
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-[70vw]">
          <DialogHeader>
            <DialogTitle className="text-lg">Outputs</DialogTitle>
            <DialogDescription>{row.original.name}</DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] h-[50vh] overflow-y-auto">
            <ReactJsonView
              src={row.original.outputs || {}}
              collapsed={2}
              iconStyle="circle"
              enableClipboard={({ src }) => copyToClipboard(src)}
            />
          </div>
        </DialogContent>
      </Dialog>
    ),
  },
  {
    accessorKey: "start_time",
    header: "Start Time",
    cell: ({ row }) => (
        <div className="min-w-[170px]">{dayjs(row.original.start_time).format("YYYY-MM-DD HH:mm:ss")}</div>
    ),
  },
];
