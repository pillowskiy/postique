DROP INDEX "bookmarks_user_target_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "bookmarks_user_target_idx" ON "bookmarks" USING btree ("collection_id","target_id");