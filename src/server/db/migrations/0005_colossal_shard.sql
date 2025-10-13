CREATE TABLE "treasure-hunters_game_client" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"description" varchar(256) NOT NULL,
	"api_key" varchar(256) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "treasure-hunters_match" ADD COLUMN "endedByGameClientId" uuid;--> statement-breakpoint
ALTER TABLE "treasure-hunters_match" ADD CONSTRAINT "treasure-hunters_match_endedByGameClientId_treasure-hunters_game_client_id_fk" FOREIGN KEY ("endedByGameClientId") REFERENCES "public"."treasure-hunters_game_client"("id") ON DELETE set null ON UPDATE no action;