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

export default async function Projects() {
  const result = await getProjectsAction()
  const projects = (result?.sessions || [])
    .filter((project: any) => project.session_name)
    .sort((a: any, b: any) => dayjs(b.last_create_time).diff(dayjs(a.last_create_time)))

  return (
    <>
      <div className="grid auto-rows-max items-start gap-4 p-6 pt-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"></div>
        <div>
          <Card>
            <CardHeader className="px-7">
              <CardTitle>Namespace</CardTitle>
              <CardDescription>
                You have {projects?.total_count || 0} projects in progress.
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
                  {projects?.map((project: any) => (
                    <TableRow key={project[0] || "default"}>
                      <TableCell>
                        <Link href={`/projects/${project.session_name}`}>
                          <div className="font-medium">{project.session_name || "default"}</div>
                        </Link>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {dayjs(project.first_create_time).format("YYYY-MM-DD HH:mm:ss")}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {dayjs(project.last_create_time).format("YYYY-MM-DD HH:mm:ss")}
                      </TableCell>
                      <TableCell className="text-right">{project.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
