/**
 * GA4 measurement IDs look like `G-XXXXXXXXXX`.
 *
 * The ID is CMS-editable, so it is validated before it is rendered into a
 * script tag or serialized across the server/client boundary. Lives in its own
 * module (not in the `'use client'` component) so the server layout can call it
 * directly — every export of a client module is a client reference.
 */
const MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]+$/;

export function isValidMeasurementId(id: string | undefined): id is string {
  return typeof id === 'string' && MEASUREMENT_ID_PATTERN.test(id);
}
