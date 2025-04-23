DROP INDEX "bookmark_collections_user_name_idx";--> statement-breakpoint
DROP INDEX "bookmarks_user_id_idx";--> statement-breakpoint
DROP INDEX "bookmarks_target_id_idx";--> statement-breakpoint
DROP INDEX "comments_post_id_idx";--> statement-breakpoint
DROP INDEX "comments_parent_id_idx";--> statement-breakpoint
DROP INDEX "comments_user_id_idx";--> statement-breakpoint
DROP INDEX "likes_user_target_idx";--> statement-breakpoint
DROP INDEX "likes_target_id_idx";--> statement-breakpoint
DROP INDEX "likes_user_id_idx";--> statement-breakpoint
DROP INDEX "views_referrer_idx";--> statement-breakpoint
DROP INDEX "bookmarks_collection_id_idx";--> statement-breakpoint
DROP INDEX "bookmarks_created_at_idx";--> statement-breakpoint
DROP INDEX "comments_post_time_idx";--> statement-breakpoint
DROP INDEX "comments_created_at_idx";--> statement-breakpoint
DROP INDEX "likes_created_at_idx";--> statement-breakpoint
DROP INDEX "views_created_at_idx";--> statement-breakpoint
CREATE INDEX "bookmarks_collection_id_idx" ON "bookmarks" USING btree ("collection_id");--> statement-breakpoint
CREATE INDEX "bookmarks_created_at_idx" ON "bookmarks" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "comments_post_time_idx" ON "comments" USING btree ("post_id","created_at");--> statement-breakpoint
CREATE INDEX "comments_created_at_idx" ON "comments" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "likes_created_at_idx" ON "likes" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "views_created_at_idx" ON "views" USING btree ("created_at");