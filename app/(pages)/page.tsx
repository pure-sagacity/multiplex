import { redirect } from "next/navigation";
import auth from "../lib/auth"
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/boards");
  }
  return (
    <main className="bg-white min-h-screen">
      <h1 className="text-2xl text-black bg-white p-2">Hello</h1>
    </main>
  );
}
