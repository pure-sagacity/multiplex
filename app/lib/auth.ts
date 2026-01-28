import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, username } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { user, session, account, verification } from "./schema";
import db from "./drizzle"; // your drizzle instance

const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema: {
            user,
            session,
            account,
            verification,
        },
    }),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [admin(), username(), nextCookies()],
});

export default auth;