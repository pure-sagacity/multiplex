import { getSession } from "../actions/auth/GetSession";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();

  if (!session) {
    redirect("/boards");
  }
  return (
    <main className="bg-white min-h-screen">
      <h1 className="text-2xl text-black bg-white p-2">Hello</h1>
    </main>
  );
}
