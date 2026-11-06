/**
 * Adds the table behind the manager's Social media screen.
 *
 * Run once:  node scripts/add-social-links-schema.mjs
 *
 * Additive only and safe to run twice. Until it exists the site shows just the
 * WhatsApp link and the manager explains that the screen isn't ready.
 */
import 'dotenv/config'
import pg from 'pg'

const db = new pg.Client({ connectionString: process.env.DATABASE_URL })
await db.connect()
await db.query(`
CREATE TABLE IF NOT EXISTS "social_links" (
  "id" serial PRIMARY KEY NOT NULL,
  "facebook" varchar,
  "instagram" varchar,
  "whatsapp" varchar,
  "linkedin" varchar,
  "x" varchar,
  "youtube" varchar,
  "pinterest" varchar,
  "updated_at" timestamp(3) with time zone,
  "created_at" timestamp(3) with time zone
);
`)
await db.end()
console.log('✓ Social media table is ready')
