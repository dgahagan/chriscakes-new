# ChrisCakes Website - Setup Instructions

## Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- Git

## Initial Setup Complete ✅

The following has already been configured:
- ✅ Next.js 15 with TypeScript
- ✅ Tailwind CSS v4
- ✅ ESLint + Prettier
- ✅ Sanity CMS packages installed
- ✅ Schema files created
- ✅ Environment variable structure

## Next Steps - Sanity Authentication Required

### Step 1: Authenticate with Sanity

You need to create a Sanity account and authenticate to complete the setup:

```bash
cd chriscakes-new
npx sanity login
```

Choose your preferred login method:
- Google
- GitHub
- Email/Password

### Step 2: Initialize Sanity Project

After authentication, create your Sanity project:

```bash
npx sanity init
```

When prompted:
- **Project name**: ChrisCakes
- **Use default dataset**: Yes (or choose 'production')
- **Output path**: Use the existing sanity.config.ts (it's already set up)
- **Select project to use**: Create new project

This will give you a **Project ID**. Save this for the next step.

### Step 3: Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Sanity project details:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your_api_token_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**To get your API token:**
1. Go to https://www.sanity.io/manage
2. Select your ChrisCakes project
3. Go to API → Tokens
4. Create a new token with "Editor" permissions
5. Copy the token to your `.env.local` file

### Step 4: Update sanity.config.ts (if needed)

If the project ID wasn't automatically added to `sanity.config.ts`, update it manually:

```typescript
export default defineConfig({
  // ... other config
  projectId: 'your_project_id_here',
  dataset: 'production',
  // ...
});
```

### Step 5: Start Sanity Studio

Run the Sanity Studio locally to manage content:

```bash
npm run dev
```

Then navigate to:
- **Website**: http://localhost:3000
- **Sanity Studio**: http://localhost:3000/studio (once configured)

Alternatively, you can deploy Sanity Studio separately or embed it in the Next.js app.

### Step 6: Configure CORS

Allow your website to access Sanity data:

1. Go to https://www.sanity.io/manage
2. Select your project
3. Go to API → CORS Origins
4. Add these origins:
   - `http://localhost:3000` (for development)
   - Your production domain (when ready to deploy)

## Development

### Run the development server:

```bash
npm run dev
```

Visit http://localhost:3000

### Format code:

```bash
npm run format
```

### Check formatting:

```bash
npm run format:check
```

### Lint code:

```bash
npm run lint
```

## Project Structure

```
chriscakes-new/
├── app/                 # Next.js app directory
├── lib/                 # Utility functions
│   ├── sanity.ts       # Sanity client configuration
│   └── queries.ts      # GROQ queries
├── sanity/             # Sanity configuration
│   └── schemas/        # Content schemas
│       ├── index.ts
│       ├── menuCategory.ts
│       ├── menuItem.ts
│       ├── siteSettings.ts
│       └── page.ts
├── sanity.config.ts    # Sanity Studio config
└── .env.local.example  # Environment variables template
```

## Sanity Schemas

The following content types are available:

1. **Menu Category** - For organizing menu items
2. **Menu Item** - Individual menu items with prices, descriptions, images
3. **Site Settings** - Global site settings (contact info, hours, social media)
4. **Page** - General pages (About, Services, etc.)

## Adding Content

Once Sanity Studio is running:

1. Navigate to the Studio interface
2. Create menu categories first
3. Add menu items and assign them to categories
4. Configure site settings
5. Create pages for About, Services, etc.

## Troubleshooting

### "Project ID not found"
- Make sure you've added the correct project ID to `.env.local`
- Restart the development server after changing environment variables

### "Unauthorized" errors
- Verify your API token has the correct permissions
- Make sure the token is in `.env.local` as `SANITY_API_TOKEN`

### CORS errors
- Add your localhost and production URLs to CORS origins in Sanity dashboard

## Next Phase

After completing this setup, proceed to **Phase 2** in the IMPLEMENTATION_PLAN.md:
- Content migration
- Frontend component development
- Sanity data integration

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Project Implementation Plan](../IMPLEMENTATION_PLAN.md)
- [Content Audit](../CONTENT_AUDIT.md)
