"use client";

import useSWR from "swr";
import dayjs from "dayjs";
import ReactJson from "react-json-view";

import { format, render, cancel, register } from "timeago.js";
import { CircleCheck, CircleX, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getRunsAction } from "@/actions/projects";
import { Button } from "@/components/ui/button";

export default function ProjectPage({ params }: { params: { id: string } }) {
  const { data, error, mutate, isLoading } = useSWR(
    `/actions/runs?session_name=${params.id}`,
    async () => {
      const runs = await getRunsAction(params.id);
      return runs;
    }
  );

  const session_name = params.id;
  const runs = data || [];


  const copyToClipboard = (text: Object) => {
    navigator.clipboard.writeText(JSON.stringify(text, null, 2));
  };

  return (
    <div>
      <Card x-chunk="dashboard-05-chunk-3">
        <CardHeader className="px-7">
          <CardTitle>{session_name}</CardTitle>
          <CardDescription>Recent runs from your project.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Status</TableHead>
                <TableHead className="text-left">Name</TableHead>
                <TableHead className="hidden sm:table-cell">Input</TableHead>
                <TableHead className="hidden md:table-cell">
                  Start Time
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runs.map((run: any) => (
                <TableRow key={run._id}>
                  <TableCell>
                    <div className="text-sm text-muted-foreground md:inline">
                      {run.error ? (
                        <CircleX color="#ff0000" />
                      ) : (
                        <CircleCheck color="#199400" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="sm:table-cell ">
                    <div className="max-w-[40vw] truncate">
                      {run.name}
                    </div>
                  </TableCell>
                  <TableCell className="sm:table-cell">
                    <Dialog>
                      <DialogTrigger>
                        <div className="max-w-[180px] truncate hover:underline cursor-pointer">
                          {JSON.stringify(run.inputs)}
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-[70vw]">
                        <DialogHeader>
                          <DialogTitle className="text-lg mb-2">Inputs</DialogTitle>
                          <DialogDescription>
                            <div className="h-[80vh] overflow-auto">
                              <ReactJson src={run.inputs} collapsed={2} iconStyle="circle" enableClipboard={({src})=>copyToClipboard(src)} />
                            </div>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {dayjs(run.start_time).format("YYYY-MM-DD HH:mm:ss")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
