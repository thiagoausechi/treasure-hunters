ALTER TABLE "treasure-hunters_match_collected_item" RENAME COLUMN "playerId" TO "depositedByPlayerId";--> statement-breakpoint
ALTER TABLE "treasure-hunters_match_collected_item" RENAME COLUMN "item_name" TO "item_id";--> statement-breakpoint
ALTER TABLE "treasure-hunters_match_collected_item" DROP CONSTRAINT "treasure-hunters_match_collected_item_playerId_treasure-hunters_player_id_fk";
--> statement-breakpoint
ALTER TABLE "treasure-hunters_match" ALTER COLUMN "bluePlayerId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "treasure-hunters_match" ALTER COLUMN "pinkPlayerId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "treasure-hunters_match_collected_item" ADD COLUMN "depositedAtPlayerId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "treasure-hunters_match_collected_item" ADD CONSTRAINT "treasure-hunters_match_collected_item_depositedByPlayerId_treasure-hunters_player_id_fk" FOREIGN KEY ("depositedByPlayerId") REFERENCES "public"."treasure-hunters_player"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "treasure-hunters_match_collected_item" ADD CONSTRAINT "treasure-hunters_match_collected_item_depositedAtPlayerId_treasure-hunters_player_id_fk" FOREIGN KEY ("depositedAtPlayerId") REFERENCES "public"."treasure-hunters_player"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "treasure-hunters_match_collected_item" DROP COLUMN "quantity";