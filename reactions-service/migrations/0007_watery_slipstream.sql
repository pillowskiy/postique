--> statement-breakpoint
ALTER TABLE bookmark_collections ADD COLUMN slug varchar(384);
UPDATE bookmark_collections SET slug = id;
ALTER TABLE bookmark_collections ALTER COLUMN slug SET NOT NULL;
ALTER TABLE bookmark_collections ADD CONSTRAINT bookmark_collections_slug_unique UNIQUE (
    slug
);
