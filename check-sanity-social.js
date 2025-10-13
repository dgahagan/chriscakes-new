import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '9t9xlmvm',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

const query = `*[_type == "siteSettings"][0] {
  socialMedia,
  shareButtons
}`;

client.fetch(query).then(data => {
  console.log('Current Sanity Social Media Configuration:');
  console.log(JSON.stringify(data, null, 2));
}).catch(err => {
  console.error('Error:', err.message);
});
