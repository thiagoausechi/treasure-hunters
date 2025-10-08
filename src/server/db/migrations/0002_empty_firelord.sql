CREATE TABLE "treasure-hunters_admin_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"password_hash" varchar(256) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "treasure-hunters_match" ADD COLUMN "startedByAdminId" uuid;--> statement-breakpoint
ALTER TABLE "treasure-hunters_match" ADD CONSTRAINT "treasure-hunters_match_startedByAdminId_treasure-hunters_admin_user_id_fk" FOREIGN KEY ("startedByAdminId") REFERENCES "public"."treasure-hunters_admin_user"("id") ON DELETE set null ON UPDATE no action;