/**
 * Applies the 5 November client feedback that lives in the database.
 *
 * Run once:  npx tsx scripts/apply-client-feedback-nov-5.mjs
 *
 * (tsx rather than node: this loads src/payload.config.ts.)
 *
 * It shows every change before making it and asks for "yes". In order:
 *
 *   1. Adds the table behind the new "Photos under the steps" section of the
 *      home page editor. Additive only, and safe to run twice. Until it exists
 *      the home page shows the built-in photos and the editor hides the section.
 *   2. Takes Resources out of the header menu.
 *   3. Shortens the home page location to "Peradeniya, Sri Lanka".
 *   4. Corrects the Contact page's email to info@happyfarmerslk.com.
 *   5. Corrects the contact form's reply email, which still said it came from
 *      info@happyfarmers.in.
 *
 * Revalidation is skipped while it runs (there is no Next.js server here to
 * receive it); the live site picks the changes up on the next deploy, or
 * within ten minutes on its own.
 */
import 'dotenv/config'
import readline from 'node:readline/promises'
import pg from 'pg'
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

const OLD_EMAIL = 'info@happyfarmers.in'
const NEW_EMAIL = 'info@happyfarmerslk.com'
const NEW_LOCATION = 'Peradeniya, Sri Lanka'
const quiet = { context: { disableRevalidate: true } }

// ── 1. Schema ────────────────────────────────────────────────────────────────
const SHOWCASE_DDL = `
CREATE TABLE IF NOT EXISTS "home_showcase" (
  "id" serial PRIMARY KEY NOT NULL,
  "image1_id" integer,
  "label1" varchar,
  "image2_id" integer,
  "label2" varchar,
  "updated_at" timestamp(3) with time zone,
  "created_at" timestamp(3) with time zone
);
CREATE INDEX IF NOT EXISTS "home_showcase_image1_idx" ON "home_showcase" USING btree ("image1_id");
CREATE INDEX IF NOT EXISTS "home_showcase_image2_idx" ON "home_showcase" USING btree ("image2_id");
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'home_showcase_image1_id_media_id_fk') THEN
    ALTER TABLE "home_showcase" ADD CONSTRAINT "home_showcase_image1_id_media_id_fk"
      FOREIGN KEY ("image1_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'home_showcase_image2_id_media_id_fk') THEN
    ALTER TABLE "home_showcase" ADD CONSTRAINT "home_showcase_image2_id_media_id_fk"
      FOREIGN KEY ("image2_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  END IF;
END $$;
`

const db = new pg.Client({ connectionString: process.env.DATABASE_URL })
await db.connect()
const { rows: existingTable } = await db.query(
  `SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'home_showcase'`,
)
const needsTable = existingTable.length === 0

// ── 2–5. Content: work out what would change, change nothing yet ────────────
const payload = await getPayload({ config })
const plan = []

if (needsTable) plan.push('Add the table for the home page "Photos under the steps" section')

const header = await payload.findGlobal({ slug: 'header', depth: 0 })
const keptNav = header.navItems.filter((item) => item.link?.url !== '/posts')
if (keptNav.length !== header.navItems.length) {
  plan.push(
    `Header menu: ${header.navItems.map((i) => i.link?.label).join(' · ')}\n` +
      `         → ${keptNav.map((i) => i.link?.label).join(' · ')}`,
  )
}

const home = await payload.findGlobal({ slug: 'home-page', depth: 0 })
if (home.location !== NEW_LOCATION) {
  plan.push(`Home page location: "${home.location}"\n                → "${NEW_LOCATION}"`)
}

const { docs: contactDocs } = await payload.find({
  collection: 'pages',
  where: { slug: { equals: 'contact' } },
  depth: 0,
  limit: 1,
})
const contact = contactDocs[0]
// Only the top-level fields that actually contain the old address are sent back.
const contactPatch = {}
for (const key of ['hero', 'layout', 'meta']) {
  const raw = JSON.stringify(contact?.[key] ?? null)
  if (raw.includes(OLD_EMAIL)) contactPatch[key] = JSON.parse(raw.split(OLD_EMAIL).join(NEW_EMAIL))
}
if (Object.keys(contactPatch).length) {
  plan.push(`Contact page email: ${OLD_EMAIL} → ${NEW_EMAIL}`)
}

const { docs: forms } = await payload.find({ collection: 'forms', depth: 0, limit: 20 })
const formPatches = []
for (const form of forms) {
  const emails = (form.emails ?? []).map((email) => ({
    ...email,
    emailFrom: email.emailFrom?.split(OLD_EMAIL).join(NEW_EMAIL),
    subject: email.subject?.replace(/from happyfarmers\.in/i, 'from Happy Farmers'),
  }))
  if (JSON.stringify(emails) !== JSON.stringify(form.emails ?? [])) {
    formPatches.push({ id: form.id, emails })
    plan.push(`"${form.title}" reply email: sent from ${NEW_EMAIL}, subject no longer names happyfarmers.in`)
  }
}

if (plan.length === 0) {
  console.log('Everything is already up to date. Nothing to do.')
  await db.end()
  process.exit(0)
}

console.log('\nThis will make these changes to the live database:\n')
plan.forEach((line, i) => console.log(`  ${i + 1}. ${line}`))

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const answer = await rl.question('\nType "yes" to apply them: ')
rl.close()
if (answer.trim().toLowerCase() !== 'yes') {
  console.log('Cancelled. Nothing was changed.')
  await db.end()
  process.exit(0)
}

// ── Apply ────────────────────────────────────────────────────────────────────
if (needsTable) {
  await db.query(SHOWCASE_DDL)
  console.log('✓ Photos table added')
}
await db.end()

if (keptNav.length !== header.navItems.length) {
  // Rows keep their ids, so each remaining link keeps its own fields. (Rows
  // without ids are matched by position and inherit their neighbour's.)
  await payload.updateGlobal({ slug: 'header', data: { navItems: keptNav }, ...quiet })
  console.log('✓ Resources removed from the header menu')
}

if (home.location !== NEW_LOCATION) {
  await payload.updateGlobal({ slug: 'home-page', data: { location: NEW_LOCATION }, ...quiet })
  console.log('✓ Home page location updated')
}

if (Object.keys(contactPatch).length) {
  await payload.update({
    collection: 'pages',
    id: contact.id,
    data: { ...contactPatch, _status: 'published' },
    ...quiet,
  })
  console.log('✓ Contact page email updated')
}

for (const { id, emails } of formPatches) {
  await payload.update({ collection: 'forms', id, data: { emails }, ...quiet })
  console.log('✓ Contact form reply email updated')
}

// ── Check nothing else moved ─────────────────────────────────────────────────
const homeAfter = await payload.findGlobal({ slug: 'home-page', depth: 0 })
const untouched = ['headingLine1', 'phone', 'email', 'workingHours', 'certTitle']
const drifted = untouched.filter((key) => homeAfter[key] !== home[key])
const headerAfter = await payload.findGlobal({ slug: 'header', depth: 0 })

console.log('\nCheck:')
console.log('  Header menu now:', headerAfter.navItems.map((i) => `${i.link?.label} (${i.link?.url})`).join(', '))
console.log('  Home location now:', JSON.stringify(homeAfter.location))
console.log(
  drifted.length
    ? `  WARNING: these home page fields changed unexpectedly: ${drifted.join(', ')}`
    : '  Other home page fields unchanged.',
)
console.log('\nDone.')
process.exit(0)
