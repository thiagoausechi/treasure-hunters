CREATE TABLE "treasure-hunters_match" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bluePlayerId" uuid,
	"blueScore" integer DEFAULT 0 NOT NULL,
	"pinkPlayerId" uuid,
	"pinkScore" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "treasure-hunters_player" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256),
	"email" varchar(256),
	"description" text,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "treasure-hunters_player_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "treasure-hunters_match" ADD CONSTRAINT "treasure-hunters_match_bluePlayerId_treasure-hunters_player_id_fk" FOREIGN KEY ("bluePlayerId") REFERENCES "public"."treasure-hunters_player"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "treasure-hunters_match" ADD CONSTRAINT "treasure-hunters_match_pinkPlayerId_treasure-hunters_player_id_fk" FOREIGN KEY ("pinkPlayerId") REFERENCES "public"."treasure-hunters_player"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "name_idx" ON "treasure-hunters_player" USING btree ("name");