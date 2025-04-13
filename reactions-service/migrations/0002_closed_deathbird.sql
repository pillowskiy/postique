CREATE TYPE "public"."status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."visibility" AS ENUM('public', 'private', 'unlisted', 'subscribers', 'premium');--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "description" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "cover_image" text;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "visibility" "visibility" DEFAULT 'public' NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "status" "status" DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "posts_statistic" ADD COLUMN "bookmarks_count" integer DEFAULT 0 NOT NULL;