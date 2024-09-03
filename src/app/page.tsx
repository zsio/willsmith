import clientPromise from "@/lib/mongo/mongo";
import { redirect } from 'next/navigation'


import * as React from "react"


export default function Dashboard() {
  redirect(`/projects`)
  return React.Fragment
}
