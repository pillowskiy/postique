ALTER TABLE posts_statistic DROP CONSTRAINT "posts_statistic_post_id_posts_id_fk";
--> statement-breakpoint
DROP INDEX views_target_id_idx;--> statement-breakpoint
DROP INDEX views_user_id_idx;--> statement-breakpoint
ALTER TABLE views DROP COLUMN id;
--> statement-breakpoint
ALTER TABLE likes ADD CONSTRAINT likes_target_id_user_id_pk PRIMARY KEY (
    target_id, user_id
);
--> statement-breakpoint
ALTER TABLE views ADD CONSTRAINT views_target_id_user_id_pk PRIMARY KEY (
    target_id, user_id
);
--> statement-breakpoint
ALTER TABLE posts_statistic ADD CONSTRAINT posts_statistic_post_id_posts_id_fk FOREIGN KEY (
    post_id
) REFERENCES public.posts (id) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE posts DROP COLUMN title;--> statement-breakpoint
ALTER TABLE posts DROP COLUMN description;--> statement-breakpoint
ALTER TABLE posts DROP COLUMN created_at;--> statement-breakpoint
