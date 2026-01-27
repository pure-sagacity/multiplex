CREATE TABLE "board" (
	"board_id" text PRIMARY KEY NOT NULL,
	"auth_id" text NOT NULL,
	"title" text NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"editors" text[] DEFAULT '{}' NOT NULL,
	"data" text NOT NULL
);
