import Image from "next/image";
import clientPromise from "@/lib/mongo/mongo";

export default async function Home() {

  const db = await clientPromise;
  const now = db.now()
  const time = now.getTime()


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {time}
    </main>
  );
}
