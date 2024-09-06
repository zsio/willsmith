"use client";

import dynamic from 'next/dynamic';
import useSWR from "swr";
import dayjs from "dayjs";

import { CircleCheck, CircleX, LayoutDashboard, RefreshCcw, Search } from "lucide-react";


import type { IRun } from "@/models/runs";
import { getRunsAction, getRunActionByIds } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import { columns } from './columns';
import { DataTable } from './data-table';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState, useCallback } from 'react';
import { log } from 'console';

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [list, setList] = useState<IRun[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const session_name = params.id;


  const handleSetList = (newRuns: IRun[]) => {
    setList(prevList => {
      const updatedList = prevList.map(prevItem => {
        const newItem = newRuns.find(item => item._id === prevItem._id);
        return newItem ? newItem : prevItem;
      });
      const newItems = newRuns.filter(item => !prevList.some(prevItem => prevItem._id === item._id));
      return [...updatedList, ...newItems];
    });
  }

  const handleGetRuns = useCallback(async (lastRunId?: string) => {
    setIsLoading(true)
    const runs = (await getRunsAction(params.id, 30,lastRunId)) || []
    handleSetList(runs)
    setIsLoading(false)
  }, [params.id]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (isLoading) return
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 20) {
      const lastRun = list[list.length - 1];
      if (lastRun) {
        handleGetRuns(lastRun._id as string);
      }
    }
  };

  useEffect(() => {
    handleGetRuns()
  }, [handleGetRuns])

  return (
    <div className=" h-full flex flex-col">
      <div className="p-6 pt-2">
        <div className="text-2xl font-bold flex items-center gap-2">
          <LayoutDashboard className="" />
          {session_name}
          <Button variant="outline" size="icon" onClick={() => handleGetRuns()} disabled={isLoading}>
            <RefreshCcw className={`${isLoading ? "animate-spin" : ""} w-4 h-4`} />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">Recent runs from your project.</div>
      </div>
      <div className="flex-1 overflow-auto h-full" onScroll={handleScroll}>
        <DataTable columns={columns} data={list || []} />
      </div>
    </div>
  );
}
