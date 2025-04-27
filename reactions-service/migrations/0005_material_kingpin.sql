ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_id_users_id_fk";
--> statement-breakpoint
DROP INDEX "bookmarks_user_target_idx";--> statement-breakpoint
ALTER TABLE "bookmarks" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "bookmarks" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "bookmarks" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "bookmarks_user_target_idx" ON "bookmarks" USING btree ("user_id","target_id");