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

## Deployment to Vercel

### Prerequisites for Deployment
- Git repository with your code (GitHub, GitLab, or Bitbucket)
- Sanity project ID and API token
- Vercel account (free tier available)

### Step 1: Prepare Your Repository

Ensure your code is pushed to a Git repository:

```bash
# If not already initialized
git init
git add .
git commit -m "Ready for deployment"

# Push to remote repository (GitHub example)
git remote add origin https://github.com/yourusername/chriscakes-new.git
git push -u origin main
```

### Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose your preferred method:
   - **GitHub** (recommended - enables automatic deployments)
   - GitLab
   - Bitbucket
   - Email

### Step 3: Install Vercel CLI (Optional but Recommended)

```bash
npm install -g vercel
```

Login to Vercel:

```bash
vercel login
```

### Step 4: Deploy to Vercel (Method 1: Web Dashboard)

#### Via Vercel Dashboard:

1. **Go to Vercel Dashboard**
   - Navigate to https://vercel.com/dashboard
   - Click "Add New..." → "Project"

2. **Import Git Repository**
   - Select your Git provider (GitHub/GitLab/Bitbucket)
   - Authorize Vercel to access your repositories
   - Find and select the `chriscakes-new` repository
   - Click "Import"

3. **Configure Project**
   - **Project Name**: `chriscakes` (or your preferred name)
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (or `chriscakes-new` if in subdirectory)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Add Environment Variables**

   Click "Environment Variables" and add the following:

   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
   SANITY_API_TOKEN=your_api_token_here
   NEXT_PUBLIC_SITE_URL=https://chriscakes.vercel.app
   ```

   **Important**:
   - For staging/preview deployments, add variables to "Preview" environment
   - For production, add variables to "Production" environment
   - You can add variables to all environments at once

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (~1-2 minutes)
   - Your site will be available at: `https://chriscakes.vercel.app` (or your custom URL)

### Step 5: Deploy to Vercel (Method 2: CLI)

#### Via Vercel CLI:

1. **Navigate to your project**:
   ```bash
   cd chriscakes-new
   ```

2. **Run Vercel deployment**:
   ```bash
   vercel
   ```

3. **Answer the prompts**:
   - **Set up and deploy**: Yes
   - **Which scope**: Select your account/team
   - **Link to existing project**: No (first time)
   - **Project name**: chriscakes
   - **In which directory is your code located**: ./
   - **Want to override settings**: No (use detected settings)

4. **Add environment variables** (if not done via dashboard):
   ```bash
   vercel env add NEXT_PUBLIC_SANITY_PROJECT_ID
   vercel env add NEXT_PUBLIC_SANITY_DATASET
   vercel env add NEXT_PUBLIC_SANITY_API_VERSION
   vercel env add SANITY_API_TOKEN
   vercel env add NEXT_PUBLIC_SITE_URL
   ```

   For each variable, choose the environment:
   - **Production**
   - **Preview** (staging)
   - **Development**

5. **Deploy to production**:
   ```bash
   vercel --prod
   ```

### Step 6: Configure Staging/Preview Deployments

Vercel automatically creates preview deployments for every branch and pull request.

#### Automatic Preview Deployments:

1. **Branch Deployments**:
   - Every git branch gets its own preview URL
   - Example: `https://chriscakes-git-feature-branch.vercel.app`

2. **Pull Request Deployments**:
   - Every PR gets a unique preview deployment
   - Vercel adds a comment to the PR with the preview URL
   - Updates automatically on new commits

#### Manual Preview Deployment:

```bash
# Deploy current branch to preview
vercel

# Deploy specific branch to preview
git checkout staging
vercel
```

#### Configure Preview Environment Variables:

In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. For each variable, select which environments to use:
   - ✅ Production
   - ✅ Preview (for staging)
   - ⬜ Development

**Staging-Specific Variables** (if different from production):
```
NEXT_PUBLIC_SITE_URL=https://chriscakes-staging.vercel.app
NEXT_PUBLIC_SANITY_DATASET=staging
```

### Step 7: Update Sanity CORS Settings

After deployment, add your Vercel URLs to Sanity CORS origins:

1. Go to https://www.sanity.io/manage
2. Select your ChrisCakes project
3. Navigate to API → CORS Origins
4. Add the following origins:
   ```
   https://chriscakes.vercel.app
   https://*.vercel.app (for preview deployments)
   http://localhost:3000 (for local development)
   ```
5. Click "Add Origin" for each
6. Set credentials to "Include credentials"

### Step 8: Custom Domain Setup (Optional)

#### Add Custom Domain:

1. **In Vercel Dashboard**:
   - Go to Project Settings → Domains
   - Click "Add"
   - Enter your domain: `chriscakes.com` or `www.chriscakes.com`

2. **Configure DNS** (at your domain registrar):

   **Option A - Using Vercel Nameservers (Recommended)**:
   - Point your domain's nameservers to Vercel's nameservers
   - Vercel will provide specific nameserver addresses

   **Option B - Using A/CNAME Records**:
   - For root domain (`chriscakes.com`):
     ```
     A Record: @ → 76.76.21.21
     ```
   - For www subdomain:
     ```
     CNAME Record: www → cname.vercel-dns.com
     ```

3. **SSL Certificate**:
   - Vercel automatically provisions and renews SSL certificates
   - Usually ready within a few minutes

4. **Update Environment Variables**:
   ```bash
   vercel env add NEXT_PUBLIC_SITE_URL production
   # Enter: https://chriscakes.com
   ```

5. **Update Sanity CORS**:
   - Add your custom domain to Sanity CORS origins
   - Example: `https://chriscakes.com`

### Step 9: Deployment Workflow

#### Automatic Deployments (Recommended):

Once connected to Git, Vercel automatically deploys:

1. **Production Deployments**:
   - Push to `main` or `master` branch
   - Automatically builds and deploys to production
   - Example workflow:
     ```bash
     git add .
     git commit -m "Update menu items"
     git push origin main
     # Vercel automatically deploys
     ```

2. **Preview Deployments**:
   - Push to any other branch
   - Create a pull request
   - Automatically creates preview deployment
   - Example workflow:
     ```bash
     git checkout -b feature/new-page
     git add .
     git commit -m "Add new page"
     git push origin feature/new-page
     # Vercel creates preview deployment
     ```

#### Manual Deployments:

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Redeploy latest without changes
vercel --prod --force
```

### Step 10: Vercel Project Settings

Recommended settings in Vercel Dashboard:

1. **General**:
   - Node.js Version: 20.x (or latest LTS)
   - Build & Development Settings: Auto-detected (Next.js)

2. **Git**:
   - ✅ Automatically deploy all branches
   - ✅ Preview deployments from pull requests
   - Production Branch: `main` or `master`

3. **Functions**:
   - Region: `iad1` (Washington, D.C.) - closest to Michigan
   - Or select the region closest to your users

4. **Environment Variables**:
   - ✅ Use different values for Preview vs Production if needed
   - ⚠️ Never commit `.env.local` to Git

### Deployment Checklist

Before deploying to production:

- [ ] All environment variables configured in Vercel
- [ ] Sanity CORS origins include Vercel URLs
- [ ] Build passes locally: `npm run build`
- [ ] All content imported to Sanity
- [ ] Test on preview deployment first
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Analytics configured (optional)
- [ ] Error tracking set up (optional - Sentry)

### Monitoring Your Deployment

1. **Deployment Logs**:
   - View in Vercel Dashboard → Deployments
   - Check build logs for errors
   - Monitor function execution

2. **Analytics** (Vercel Analytics - Optional):
   ```bash
   npm install @vercel/analytics
   ```

   Add to `app/layout.tsx`:
   ```typescript
   import { Analytics } from '@vercel/analytics/react';

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     );
   }
   ```

3. **Performance Monitoring**:
   - Use Vercel Speed Insights
   - Monitor Core Web Vitals
   - Check Lighthouse scores

### Troubleshooting Deployment Issues

#### Build Fails:

```bash
# Test build locally first
npm run build

# Check environment variables are set
vercel env ls

# View detailed build logs in Vercel Dashboard
```

#### Environment Variables Not Working:

- Redeploy after adding new variables
- Check variable names match exactly (case-sensitive)
- Ensure `NEXT_PUBLIC_` prefix for client-side variables

#### CORS Errors:

- Add all Vercel URLs to Sanity CORS origins
- Include `https://*.vercel.app` for preview deployments
- Wait a few minutes for CORS changes to propagate

#### 404 Errors on Routes:

- Ensure Next.js is using App Router (not Pages Router)
- Check `outputFileTracingRoot` in `next.config.ts`
- Verify all pages exist in `app/` directory

### Rollback a Deployment

If something goes wrong:

1. **Via Dashboard**:
   - Go to Deployments
   - Find the working deployment
   - Click "..." → "Promote to Production"

2. **Via CLI**:
   ```bash
   vercel rollback
   ```

### Staging Environment Best Practices

1. **Use a staging dataset in Sanity**:
   - Create a `staging` dataset in Sanity
   - Use different environment variables for preview deployments
   - Test content changes in staging before production

2. **Branch Strategy**:
   - `main` → Production
   - `staging` → Staging environment
   - `feature/*` → Preview deployments

3. **Testing Workflow**:
   - Test on preview deployment
   - Merge to `staging` branch
   - Test on staging environment
   - Merge to `main` for production

## Next Phase

After completing this setup and deployment, proceed to **Phase 5** in the IMPLEMENTATION_PLAN.md:
- User acceptance testing on staging environment
- Performance testing and optimization
- Cross-browser compatibility testing
- Owner training on content management

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Project Implementation Plan](../IMPLEMENTATION_PLAN.md)
- [Content Audit](../CONTENT_AUDIT.md)
