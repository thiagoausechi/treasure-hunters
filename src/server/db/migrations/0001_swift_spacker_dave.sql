CREATE TYPE "public"."match_status" AS ENUM('PENDING', 'COMPLETED');--> statement-breakpoint
CREATE TABLE "treasure-hunters_match_collected_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"matchId" uuid NOT NULL,
	"playerId" uuid NOT NULL,
	"item_name" varchar(256) NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "treasure-hunters_match" ALTER COLUMN "blueScore" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "treasure-hunters_match" ALTER COLUMN "blueScore" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "treasure-hunters_match" ALTER COLUMN "pinkScore" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "treasure-hunters_match" ALTER COLUMN "pinkScore" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "treasure-hunters_match" ADD COLUMN "status" "match_status" DEFAULT 'PENDING' NOT NULL;--> statement-breakpoint
ALTER TABLE "treasure-hunters_match" ADD COLUMN "durationInSeconds" integer;--> statement-breakpoint
ALTER TABLE "treasure-hunters_match_collected_item" ADD CONSTRAINT "treasure-hunters_match_collected_item_matchId_treasure-hunters_match_id_fk" FOREIGN KEY ("matchId") REFERENCES "public"."treasure-hunters_match"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "treasure-hunters_match_collected_item" ADD CONSTRAINT "treasure-hunters_match_collected_item_playerId_treasure-hunters_player_id_fk" FOREIGN KEY ("playerId") REFERENCES "public"."treasure-hunters_player"("id") ON DELETE no action ON UPDATE no action;