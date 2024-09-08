"use client";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getProjectsAction } from "@/actions/projects";
import dayjs from "dayjs";
import useSWR from "swr";
import { Loader2 } from "lucide-react";

const code = `
LANGCHAIN_TRACING_V2=true
LANGCHAIN_ENDPOINT="http://localhost:3000"
LANGCHAIN_API_KEY="Any value, no key validation yet"
LANGCHAIN_PROJECT="your-project-name"
`;

export default function Projects() {
  const {
    data: projects,
    error,
    isLoading,
  } = useSWR("/api/projects", async () => {
    const result = await getProjectsAction();
    return (result?.sessions || [])
      .filter((project: any) => project.session_name)
      .sort((a: any, b: any) =>
        dayjs(b.last_create_time).diff(dayjs(a.last_create_time))
      );
  });

  return (
    <>
      <div className="grid auto-rows-max items-start gap-4 p-6 pt-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"></div>
        <div>
          <Card>
            <CardHeader className="px-7">
              <CardTitle>Namespace</CardTitle>
              <CardDescription>
                You have {projects?.length || 0} projects in progress.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead className="hidden md:table-cell">
                      First Create Time
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Last Create Time
                    </TableHead>
                    <TableHead className="text-right">Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <div className="flex justify-center items-center">
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {!isLoading && projects?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <div className=" flex-col">
                          <div className="flex flex-col text-center">
                            <p className="text-lg font-bold my-2">
                              No projects found.
                            </p>
                            <p className="text-sm text-gray-500 my-3">
                              You can use the LangSmith environment variables in
                              your LangChain project to use this project.
                            </p>
                          </div>
                          <pre className="bg-gray-100 p-2 rounded-md">
                            <code>{code}</code>
                          </pre>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    projects?.map((project: any) => (
                      <TableRow key={project.session_name || "default"}>
                        <TableCell>
                          <Link href={`/projects/${project.session_name}`}>
                            <div className="font-medium">
                              {project.session_name || "default"}
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {dayjs(project.first_create_time).format(
                            "YYYY-MM-DD HH:mm:ss"
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {dayjs(project.last_create_time).format(
                            "YYYY-MM-DD HH:mm:ss"
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {project.count}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
