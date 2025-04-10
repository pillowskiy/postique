CREATE TABLE "bookmark_collections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookmarks" (
	"id" uuid NOT NULL,
	"target_id" uuid NOT NULL,
	"collection_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"post_id" uuid NOT NULL,
	"parent_id" uuid,
	"content" text NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "likes" (
	"user_id" uuid,
	"target_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts_statistic" (
	"post_id" uuid NOT NULL,
	"views_count" integer DEFAULT 0 NOT NULL,
	"likes_count" integer DEFAULT 0 NOT NULL,
	"comments_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"avatar_path" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"target_id" uuid NOT NULL,
	"read_percentage" integer DEFAULT 0 NOT NULL,
	"reading_time" integer DEFAULT 0 NOT NULL,
	"referrer" varchar(255),
	"user_agent" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookmark_collections" ADD CONSTRAINT "bookmark_collections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_target_id_posts_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_collection_id_bookmark_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."bookmark_collections"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_comments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_target_id_posts_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts_statistic" ADD CONSTRAINT "posts_statistic_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "views" ADD CONSTRAINT "views_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "views" ADD CONSTRAINT "views_target_id_posts_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "bookmark_collections_user_name_idx" ON "bookmark_collections" USING btree ("user_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "bookmarks_user_target_idx" ON "bookmarks" USING btree ("id","target_id");--> statement-breakpoint
CREATE UNIQUE INDEX "bookmarks_user_id_idx" ON "bookmarks" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX "bookmarks_collection_id_idx" ON "bookmarks" USING btree ("collection_id");--> statement-breakpoint
CREATE UNIQUE INDEX "bookmarks_target_id_idx" ON "bookmarks" USING btree ("target_id");--> statement-breakpoint
CREATE UNIQUE INDEX "bookmarks_created_at_idx" ON "bookmarks" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "comments_post_id_idx" ON "comments" USING btree ("post_id");--> statement-breakpoint
CREATE UNIQUE INDEX "comments_parent_id_idx" ON "comments" USING btree ("parent_id");--> statement-breakpoint
CREATE UNIQUE INDEX "comments_user_id_idx" ON "comments" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "comments_post_time_idx" ON "comments" USING btree ("post_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "comments_created_at_idx" ON "comments" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "likes_user_target_idx" ON "likes" USING btree ("user_id","target_id");--> statement-breakpoint
CREATE UNIQUE INDEX "likes_target_id_idx" ON "likes" USING btree ("target_id");--> statement-breakpoint
CREATE UNIQUE INDEX "likes_user_id_idx" ON "likes" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "likes_created_at_idx" ON "likes" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "views_target_id_idx" ON "views" USING btree ("target_id");--> statement-breakpoint
CREATE UNIQUE INDEX "views_user_id_idx" ON "views" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "views_created_at_idx" ON "views" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "views_referrer_idx" ON "views" USING btree ("referrer");