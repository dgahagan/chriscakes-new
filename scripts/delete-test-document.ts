/**
 * One-off migration: remove the leftover `test-dynamic-page` fixture document.
 *
 * This was a development artifact that shipped into the production dataset and
 * rendered as a real page. Deleting it was approved by the site owner
 * (2026-07-26).
 *
 * This script is idempotent: once the document is gone it reports "nothing to
 * do" and exits 0. It refuses to run without `--yes` and prints the target
 * project and dataset before touching anything.
 *
 *   npx tsx scripts/delete-test-document.ts --yes
 */
import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SLUG = 'test-dynamic-page';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

async function main() {
  if (!projectId) {
    throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID is not set');
  }
  if (!token) {
    throw new Error('SANITY_API_TOKEN is not set (required to delete)');
  }

  console.log(`Target project : ${projectId}`);
  console.log(`Target dataset : ${dataset}`);
  console.log(`Target slug    : ${SLUG}`);

  if (!process.argv.includes('--yes')) {
    console.error(
      '\nRefusing to run without --yes. Re-run with --yes to delete.'
    );
    process.exit(1);
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: false,
    token,
  });

  const matches = await client.fetch<Array<{ _id: string; title?: string }>>(
    `*[_type == "page" && slug.current == $slug]{ _id, title }`,
    { slug: SLUG }
  );

  if (matches.length === 0) {
    console.log('\nNothing to do — no document with that slug exists.');
    return;
  }

  if (matches.length > 1) {
    throw new Error(
      `Expected at most one match, found ${matches.length}: ${matches
        .map((m) => m._id)
        .join(', ')}. Aborting rather than guessing.`
    );
  }

  const target = matches[0];
  console.log(`\nDeleting ${target._id} ("${target.title}")`);

  // Delete the published document and its draft counterpart, if any.
  await client
    .transaction()
    .delete(target._id)
    .delete(`drafts.${target._id}`)
    .commit({ visibility: 'sync' });

  const remaining = await client.fetch<number>(
    `count(*[_type == "page" && slug.current == $slug])`,
    { slug: SLUG }
  );
  const pageCount = await client.fetch<number>(`count(*[_type == "page"])`);

  console.log(`Remaining documents with that slug: ${remaining}`);
  console.log(`Total page documents now: ${pageCount}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
