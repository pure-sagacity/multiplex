import { getSession } from '@/app/actions/auth/GetSession';
import { redirect } from 'next/navigation';
import { user } from '@/app/lib/schema';
import db from '@/app/lib/drizzle';
import CreateBoardClient from './CreateBoardClient';
import CreateBoard from '@/app/actions/Boards/CreateBoard';

export default async function CreateBoardPage() {
    const session = await getSession();
    if (!session) {
        redirect("/login");
    }
    // Fetch users on the server
    const users = (await db.select().from(user)).filter((u) => u.id !== session.user?.id);
    // Pass users and server action as prop to client component
    return <CreateBoardClient users={users} createBoardAction={CreateBoard} />;
}
