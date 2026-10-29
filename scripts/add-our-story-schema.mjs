/**
 * Adds the tables behind the Our Story screen in the manager.
 *
 * Run once:  node scripts/add-our-story-schema.mjs
 *
 * Why this exists rather than `payload migrate`: the database was built with
 * Payload's dev schema sync and so has no migration history. Asking Payload to
 * generate a migration produces a full baseline whose "down" drops every table
 * in the database — not something to keep in the repo.
 *
 * Everything here is additive and safe to run twice: each statement is guarded
 * by IF NOT EXISTS, and nothing is dropped, altered or deleted. Until it has
 * been run the Our Story page still renders from its built-in wording, so there
 * is no rush and no outage either way.
 */
import 'dotenv/config'
import pg from 'pg'

const TABLES = `
CREATE TABLE IF NOT EXISTS "our_story_page" (
  "id" serial PRIMARY KEY NOT NULL,
  "ribbon_text" varchar,
  "hero_eyebrow" varchar,
  "heading_line1" varchar,
  "heading_line2" varchar,
  "hero_subtext" varchar,
  "hero_button_label" varchar,
  "hero_image_id" integer,
  "story_eyebrow" varchar,
  "story_heading" varchar,
  "story_image_id" integer,
  "mission_title" varchar,
  "mission_text" varchar,
  "vision_title" varchar,
  "vision_text" varchar,
  "closing_heading" varchar,
  "closing_subtext" varchar,
  "closing_button_label" varchar,
  "closing_image_id" integer,
  "meta_title" varchar,
  "meta_image_id" integer,
  "meta_description" varchar,
  "updated_at" timestamp(3) with time zone,
  "created_at" timestamp(3) with time zone
);
CREATE TABLE IF NOT EXISTS "our_story_page_story_paragraphs" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "text" varchar
);
CREATE TABLE IF NOT EXISTS "our_story_page_highlights" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "text" varchar
);
CREATE INDEX IF NOT EXISTS "our_story_page_story_paragraphs_order_idx" ON "our_story_page_story_paragraphs" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "our_story_page_story_paragraphs_parent_id_idx" ON "our_story_page_story_paragraphs" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "our_story_page_highlights_order_idx" ON "our_story_page_highlights" USING btree ("_order");
CREATE INDEX IF NOT EXISTS "our_story_page_highlights_parent_id_idx" ON "our_story_page_highlights" USING btree ("_parent_id");
CREATE INDEX IF NOT EXISTS "our_story_page_hero_image_idx" ON "our_story_page" USING btree ("hero_image_id");
CREATE INDEX IF NOT EXISTS "our_story_page_story_image_idx" ON "our_story_page" USING btree ("story_image_id");
CREATE INDEX IF NOT EXISTS "our_story_page_closing_image_idx" ON "our_story_page" USING btree ("closing_image_id");
CREATE INDEX IF NOT EXISTS "our_story_page_meta_meta_image_idx" ON "our_story_page" USING btree ("meta_image_id");
`

const FOREIGN_KEYS = [
  [
    'our_story_page_story_paragraphs',
    'our_story_page_story_paragraphs_parent_id_fk',
    'FOREIGN KEY ("_parent_id") REFERENCES "public"."our_story_page"("id") ON DELETE cascade ON UPDATE no action',
  ],
  [
    'our_story_page_highlights',
    'our_story_page_highlights_parent_id_fk',
    'FOREIGN KEY ("_parent_id") REFERENCES "public"."our_story_page"("id") ON DELETE cascade ON UPDATE no action',
  ],
  [
    'our_story_page',
    'our_story_page_hero_image_id_media_id_fk',
    'FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action',
  ],
  [
    'our_story_page',
    'our_story_page_story_image_id_media_id_fk',
    'FOREIGN KEY ("story_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action',
  ],
  [
    'our_story_page',
    'our_story_page_closing_image_id_media_id_fk',
    'FOREIGN KEY ("closing_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action',
  ],
  [
    'our_story_page',
    'our_story_page_meta_image_id_media_id_fk',
    'FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action',
  ],
]

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

try {
  await client.query(TABLES)

  for (const [table, name, definition] of FOREIGN_KEYS) {
    await client.query(`DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '${name}') THEN
        ALTER TABLE "${table}" ADD CONSTRAINT "${name}" ${definition};
      END IF;
    END $$;`)
  }

  const { rows } = await client.query(
    `SELECT table_name FROM information_schema.tables
     WHERE table_schema = 'public' AND table_name LIKE 'our_story%' ORDER BY 1`,
  )
  console.log('Our Story tables present:', rows.map((r) => r.table_name).join(', '))
  console.log('Done. The Our Story screen in the manager is now ready to save.')
} finally {
  await client.end()
}
