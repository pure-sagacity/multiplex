import { toNextJsHandler } from "better-auth/next-js";
import auth from "@/app/lib/auth";

const handler = toNextJsHandler(auth);

export const POST = handler;
export const GET = handler;
