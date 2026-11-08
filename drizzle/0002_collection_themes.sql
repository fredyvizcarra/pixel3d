ALTER TABLE "categories" ADD COLUMN "tagline" text;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "theme" text DEFAULT 'default' NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "accent_color" text;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "featured" boolean DEFAULT false NOT NULL;