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

## Contact Form Setup with Resend

The website includes a contact form that sends emails using **Resend**, a developer-friendly email service with a generous free tier (3,000 emails/month).

### Step 1: Create a Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Click "Sign Up" (free account required)
3. Verify your email address
4. Complete account setup

### Step 2: Get Your Resend API Key

1. Log in to your Resend dashboard
2. Navigate to **API Keys** in the left sidebar
3. Click "Create API Key"
4. Give it a name (e.g., "ChrisCakes Production")
5. Select permissions: **Sending access** (default)
6. Click "Create"
7. **Copy the API key immediately** - you won't be able to see it again!

### Step 3: Configure Email Domain (Optional but Recommended)

For production use, you should verify your own domain. During development and testing, you can use Resend's testing domain.

#### Option A: Use Testing Domain (Development Only)
- Resend provides `onboarding@resend.dev` for testing
- Emails will be delivered but marked as "via resend.dev"
- **Not recommended for production**

#### Option B: Verify Your Own Domain (Production)

1. In Resend dashboard, go to **Domains**
2. Click "Add Domain"
3. Enter your domain (e.g., `chriscakes.com`)
4. Add the DNS records provided by Resend to your domain registrar:
   - **SPF Record** (TXT record)
   - **DKIM Records** (TXT records)
   - **DMARC Record** (TXT record, optional but recommended)
5. Wait for DNS propagation (can take up to 48 hours, usually much faster)
6. Click "Verify DNS Records" in Resend dashboard
7. Once verified, you can send emails from any address at your domain (e.g., `noreply@chriscakes.com`)

**DNS Records Example:**
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all

Type: TXT
Name: resend._domainkey
Value: [provided by Resend]

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:your-email@chriscakes.com
```

### Step 4: Configure Environment Variables

Add the following to your `.env.local` file:

```env
# Resend Email Service (for contact form)
RESEND_API_KEY=re_123abc456def789  # Your API key from Step 2
CONTACT_EMAIL_TO=chriscakesmi@sbcglobal.net  # Fallback email (optional)
RESEND_FROM_EMAIL=noreply@chriscakes.com  # Must be verified domain
```

**Important Notes:**
- `RESEND_API_KEY`: Your API key from Resend dashboard (required)
- `CONTACT_EMAIL_TO`: Fallback email address (optional - use Sanity instead, see Step 5)
- `RESEND_FROM_EMAIL`: Must be either:
  - `onboarding@resend.dev` (for testing only)
  - An email address from your verified domain (for production)

### Step 5: Configure Email Recipients in Sanity Studio (Recommended)

**The preferred way to manage email recipients is through Sanity Studio**, allowing restaurant owners to update recipients without touching code or environment variables.

1. Navigate to **Sanity Studio**: http://localhost:3000/studio

2. Go to **Site Settings** (there should be only one document)

3. Scroll to **Contact Form Recipients** section

4. Add email addresses that should receive contact form submissions:
   - Click "Add item"
   - Enter an email address (e.g., `chriscakesmi@sbcglobal.net`)
   - Add more as needed (e.g., owner's personal email, manager's email)
   - You can add/remove recipients anytime

5. Click "Publish" to save changes

**Benefits of managing recipients in Sanity:**
- ✅ Add multiple recipients for redundancy
- ✅ Update recipients without redeploying
- ✅ Non-technical owners can manage the list
- ✅ See all recipients in one place
- ✅ Validation ensures valid email formats

**Fallback Behavior:**
- If Sanity recipients are configured, they are used (recommended)
- If not configured, falls back to `CONTACT_EMAIL_TO` environment variable
- At least one recipient method must be configured

### Step 6: Test the Contact Form Locally

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to [http://localhost:3000/contact](http://localhost:3000/contact)

3. Fill out and submit the contact form

4. Check your inbox at the configured recipient email(s)

5. Check Resend dashboard → Emails to see delivery status
   - You should see all recipients listed in the "To" field

6. Check the terminal output for confirmation:
   ```
   Email sent successfully to 2 recipient(s): [...]
   ```

### Step 7: Add Environment Variables to Vercel

When deploying to production, add these environment variables in Vercel:

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - `RESEND_API_KEY` → Your production API key (required)
   - `RESEND_FROM_EMAIL` → Your verified domain email (required)
   - `CONTACT_EMAIL_TO` → Fallback email (optional if using Sanity)
4. Select which environments (Production, Preview, Development)
5. Click "Save"
6. Redeploy your application

**Via Vercel CLI:**
```bash
vercel env add RESEND_API_KEY
vercel env add RESEND_FROM_EMAIL
vercel env add CONTACT_EMAIL_TO  # Optional
```

**Note:** Manage email recipients in Sanity Studio instead of environment variables for easier updates without redeployment.

### Security Features

The contact form includes several spam protection measures:

1. **Rate Limiting**: Maximum 3 submissions per hour per IP address
2. **Server-side Validation**: Email format, required fields validated on backend
3. **Honeypot Field**: (Can be added if spam becomes an issue)
4. **CORS Protection**: API route only accepts requests from your domain

### Monitoring Email Delivery

1. **Resend Dashboard**:
   - View all sent emails
   - Check delivery status
   - See bounce rates and errors
   - Monitor API usage

2. **Email Logs**:
   - Access detailed logs for each email
   - Track opens and clicks (if enabled)
   - Debug delivery issues

3. **Webhooks** (Optional):
   - Set up webhooks to get notified of delivery events
   - Track bounces, complaints, and deliveries

### Troubleshooting Contact Form

#### Emails Not Sending

1. **Check API Key**: Verify `RESEND_API_KEY` is correct in `.env.local`
2. **Check Domain Verification**: If using custom domain, ensure DNS records are verified
3. **Check Logs**: Look at browser console and terminal for error messages
4. **Check Resend Dashboard**: View email logs for delivery status
5. **Test with Testing Domain**: Try `onboarding@resend.dev` first

#### Emails Going to Spam

1. **Verify Domain**: Use a verified domain instead of testing domain
2. **Set up SPF/DKIM**: Ensure all DNS records are properly configured
3. **Add DMARC**: Helps prevent spoofing and improves deliverability
4. **Avoid Spam Triggers**: Check email content for common spam phrases

#### Rate Limit Errors

- **Symptom**: "Too many requests" error
- **Solution**: Rate limit is 3 submissions per hour per IP
- **Override**: Increase limit in `app/api/contact/route.ts` if needed
- **Production**: Consider using Cloudflare Turnstile for better bot protection

### Resend Free Tier Limits

- **3,000 emails per month** (free forever)
- **100 emails per day** (free tier)
- For higher volumes, see [Resend Pricing](https://resend.com/pricing)

For a catering business like ChrisCakes, the free tier should be more than sufficient.

### Alternative: Adding Cloudflare Turnstile (Optional)

For additional spam protection, you can add Cloudflare Turnstile (free, privacy-focused CAPTCHA):

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Turnstile**
3. Create a new site
4. Copy your **Site Key** and **Secret Key**
5. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key
   TURNSTILE_SECRET_KEY=your_secret_key
   ```
6. Update contact form component to include Turnstile widget
7. Verify token on backend before sending email

This is optional and can be added later if spam becomes an issue.

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

## Domain Migration to Cloudflare with Vercel Proxy

This section covers migrating **chriscakesofmi.com** from its current host to Cloudflare, then configuring Cloudflare to proxy traffic to your Vercel deployment. This setup provides:

- ✅ **DDoS Protection** - Cloudflare's network protects against attacks
- ✅ **Global CDN** - Static assets cached at edge locations worldwide
- ✅ **SSL/TLS** - Free SSL certificates with flexible encryption options
- ✅ **Performance** - Auto-minification, Brotli compression, HTTP/3 support
- ✅ **Analytics** - Free analytics and security insights
- ✅ **100% Free** - All features on Cloudflare's free tier

### Architecture Overview

```
User Request
    ↓
Cloudflare (Proxy + CDN)
    ↓
Vercel (Next.js Application)
    ↓
Sanity CMS (Content)
```

### Prerequisites

Before starting:
- [ ] Vercel deployment is working (previous section completed)
- [ ] Access to current domain registrar account (to update nameservers)
- [ ] Email address for Cloudflare account
- [ ] Domain is not locked at registrar (unlock if necessary)

### Step 1: Create Cloudflare Account

1. **Sign Up for Cloudflare**:
   - Go to [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)
   - Enter your email address
   - Create a strong password
   - Verify your email address

2. **Choose Plan**:
   - Select **Free Plan** (more than sufficient for this site)
   - The free plan includes everything you need

### Step 2: Add Domain to Cloudflare

1. **Add Site**:
   - Click "Add a Site" in Cloudflare Dashboard
   - Enter: `chriscakesofmi.com` (without www)
   - Click "Add Site"

2. **Select Plan**:
   - Choose **Free** plan
   - Click "Continue"

3. **DNS Records Scan**:
   - Cloudflare will scan your current DNS records (takes ~1 minute)
   - Review the detected records
   - Click "Continue"

4. **Review Imported DNS Records**:
   - Cloudflare imports existing DNS records from your current host
   - **Important**: Review carefully and note any records you need
   - Common records you might see:
     - `A` record for `@` (root domain)
     - `A` or `CNAME` record for `www`
     - `MX` records (for email - **very important to preserve**)
     - `TXT` records (for email verification, SPF, DKIM)

   **⚠️ CRITICAL**: If you use email with your domain (e.g., `contact@chriscakesofmi.com`), make sure all MX, SPF, DKIM, and DMARC records are preserved!

### Step 3: Update DNS Records for Vercel

Now we'll configure DNS to point to Vercel while keeping email records intact.

1. **Delete Old Website Records** (if present):
   - Look for `A` records pointing to old server IPs
   - Look for `CNAME` records pointing to old hosts
   - **Delete only website-related records** (keep email records!)

2. **Add Vercel DNS Records**:

   **For Root Domain** (`chriscakesofmi.com`):
   - Click "Add Record"
   - **Type**: `CNAME`
   - **Name**: `@`
   - **Target**: `cname.vercel-dns.com`
   - **Proxy status**: 🟠 Proxied (orange cloud) - **IMPORTANT**
   - **TTL**: Auto
   - Click "Save"

   **For WWW Subdomain** (`www.chriscakesofmi.com`):
   - Click "Add Record"
   - **Type**: `CNAME`
   - **Name**: `www`
   - **Target**: `cname.vercel-dns.com`
   - **Proxy status**: 🟠 Proxied (orange cloud) - **IMPORTANT**
   - **TTL**: Auto
   - Click "Save"

3. **Verify Email Records Preserved** (if applicable):
   - `MX` records should still be present
   - **Proxy status**: 🔵 DNS Only (gray cloud) - email records must NOT be proxied
   - If missing, add them back from your old DNS configuration

4. **Add Resend Email Records** (for contact form):

   Add these records for the Resend email service:

   **SPF Record**:
   - **Type**: `TXT`
   - **Name**: `@`
   - **Content**: `v=spf1 include:_spf.resend.com ~all`
   - **Proxy status**: 🔵 DNS Only (gray cloud)
   - **TTL**: Auto

   **DKIM Record** (get value from Resend dashboard):
   - **Type**: `TXT`
   - **Name**: `resend._domainkey`
   - **Content**: [provided by Resend when you add domain]
   - **Proxy status**: 🔵 DNS Only (gray cloud)
   - **TTL**: Auto

   **DMARC Record**:
   - **Type**: `TXT`
   - **Name**: `_dmarc`
   - **Content**: `v=DMARC1; p=none; rua=mailto:your-email@chriscakesofmi.com`
   - **Proxy status**: 🔵 DNS Only (gray cloud)
   - **TTL**: Auto

### Step 4: Update Nameservers at Current Registrar

Cloudflare will provide you with two nameservers. You need to update these at your current domain registrar.

1. **Copy Cloudflare Nameservers**:
   - Cloudflare shows two nameservers (example):
     ```
     alec.ns.cloudflare.com
     zara.ns.cloudflare.com
     ```
   - Copy both nameservers

2. **Login to Current Domain Registrar**:
   - Go to your domain registrar's website (GoDaddy, Namecheap, Google Domains, etc.)
   - Login to your account
   - Find domain management section

3. **Locate Nameserver Settings**:
   - Look for "Nameservers", "DNS Settings", or "Domain Settings"
   - May be under "Advanced Settings"

4. **Update Nameservers**:
   - Switch from "Default" or "Basic DNS" to "Custom Nameservers"
   - Remove old nameservers
   - Add the two Cloudflare nameservers
   - Save changes

5. **Unlock Domain** (if needed):
   - Some registrars lock domains by default
   - If locked, unlock it temporarily to change nameservers
   - Re-lock after nameserver change is complete

### Step 5: Wait for DNS Propagation

1. **Verify in Cloudflare**:
   - Return to Cloudflare dashboard
   - Click "Done, check nameservers"
   - Cloudflare will check periodically (can take up to 24 hours, usually much faster)

2. **Check Propagation Status**:
   - Use [https://www.whatsmydns.net/](https://www.whatsmydns.net/)
   - Enter: `chriscakesofmi.com`
   - Select "NS" (nameserver) record type
   - Check if Cloudflare nameservers appear globally
   - Propagation time: **15 minutes to 24 hours** (typically 1-2 hours)

3. **You'll receive an email**:
   - Cloudflare sends confirmation when nameservers are active
   - Subject: "Cloudflare is now protecting your domain"

### Step 6: Configure Cloudflare SSL/TLS Settings

After nameservers are active, configure SSL:

1. **Go to SSL/TLS Settings**:
   - In Cloudflare dashboard, click "SSL/TLS"
   - Select "Overview"

2. **Set Encryption Mode**:
   - Choose **"Full (strict)"** - recommended for Vercel
   - This ensures end-to-end encryption
   - Vercel automatically provides SSL certificates

3. **Enable Always Use HTTPS**:
   - Go to SSL/TLS → Edge Certificates
   - Toggle "Always Use HTTPS" to **On**
   - Redirects all HTTP traffic to HTTPS

4. **Enable Automatic HTTPS Rewrites**:
   - In same section, toggle "Automatic HTTPS Rewrites" to **On**
   - Prevents mixed content warnings

5. **Minimum TLS Version**:
   - Set to **TLS 1.2** (recommended)
   - Better security than TLS 1.0/1.1

### Step 7: Configure Vercel for Custom Domain

Now configure Vercel to accept traffic from your custom domain:

1. **Add Domain in Vercel Dashboard**:
   - Go to your project in Vercel
   - Navigate to Settings → Domains
   - Click "Add"
   - Enter `chriscakesofmi.com`
   - Click "Add"
   - Also add `www.chriscakesofmi.com`
   - Click "Add"

2. **Vercel Domain Configuration**:
   - Vercel will show configuration instructions
   - **You can ignore these** - we already configured DNS in Cloudflare
   - Vercel will automatically detect the CNAME records via Cloudflare

3. **Set Primary Domain**:
   - Choose which domain is primary:
     - `chriscakesofmi.com` (root) - recommended
     - OR `www.chriscakesofmi.com`
   - The non-primary domain will redirect to primary
   - Click the "..." menu next to domain
   - Select "Set as Primary"

### Step 8: Update Environment Variables

Update the site URL in Vercel environment variables:

1. **In Vercel Dashboard**:
   - Go to Settings → Environment Variables
   - Find `NEXT_PUBLIC_SITE_URL`
   - Click "Edit"
   - Change value to: `https://chriscakesofmi.com`
   - Select "Production" environment
   - Click "Save"

2. **Redeploy**:
   ```bash
   vercel --prod
   ```

   Or push a new commit to trigger automatic deployment.

### Step 9: Update Sanity CORS Settings

Update Sanity to allow requests from your custom domain:

1. **Go to Sanity Management Console**:
   - Visit https://www.sanity.io/manage
   - Select your ChrisCakes project

2. **Add CORS Origins**:
   - Navigate to API → CORS Origins
   - Click "Add CORS Origin"
   - Add the following origins:
     ```
     https://chriscakesofmi.com
     https://www.chriscakesofmi.com
     https://*.vercel.app (keep for preview deployments)
     http://localhost:3000 (keep for local development)
     ```
   - For each, set credentials to "Include credentials"
   - Click "Save"

### Step 10: Optimize Cloudflare Settings

Configure Cloudflare for optimal performance and security:

#### Speed Settings:

1. **Go to Speed → Optimization**:
   - **Auto Minify**: Enable HTML, CSS, JavaScript
   - **Brotli**: Enable (better compression than gzip)
   - **Rocket Loader**: Off (can break React/Next.js)
   - **Mirage**: Enable (image optimization)

2. **Caching**:
   - Go to Caching → Configuration
   - **Caching Level**: Standard
   - **Browser Cache TTL**: Respect Existing Headers (recommended for Next.js)
   - **Always Online**: Enable (serves cached version if Vercel is down)

3. **Page Rules** (Optional but Recommended):
   - Go to Rules → Page Rules
   - Click "Create Page Rule"

   **Rule 1: Cache Static Assets**
   - **URL**: `chriscakesofmi.com/_next/static/*`
   - Settings:
     - Cache Level: Cache Everything
     - Edge Cache TTL: 1 month
   - Click "Save and Deploy"

   **Rule 2: Cache Images**
   - **URL**: `chriscakesofmi.com/images/*`
   - Settings:
     - Cache Level: Cache Everything
     - Edge Cache TTL: 1 month
   - Click "Save and Deploy"

#### Security Settings:

1. **Go to Security → Settings**:
   - **Security Level**: Medium (blocks obvious threats)
   - **Challenge Passage**: 30 minutes
   - **Browser Integrity Check**: Enable

2. **Go to Security → Bots**:
   - **Bot Fight Mode**: Enable (free tier)
   - Blocks automated traffic

3. **Go to SSL/TLS → Edge Certificates**:
   - **Opportunistic Encryption**: Enable
   - **TLS 1.3**: Enable
   - **HTTP Strict Transport Security (HSTS)**: Enable (see below)

4. **Configure HSTS** (after testing site works):
   - **Max Age Header**: 6 months (15768000)
   - **Apply HSTS to subdomains**: Yes
   - **Preload**: No (unless you're absolutely sure)
   - **No-Sniff Header**: Yes

#### Network Settings:

1. **Go to Network**:
   - **HTTP/2**: Enable (should be on by default)
   - **HTTP/3 (with QUIC)**: Enable (faster connection)
   - **0-RTT Connection Resumption**: Enable (faster subsequent visits)
   - **IPv6 Compatibility**: Enable
   - **WebSockets**: Enable

### Step 11: Test Your Setup

Verify everything is working correctly:

1. **Test Domain Resolution**:
   ```bash
   # Test domain resolves
   ping chriscakesofmi.com

   # Check DNS records
   dig chriscakesofmi.com

   # Verify nameservers
   dig NS chriscakesofmi.com
   ```

2. **Test Website Access**:
   - Visit `http://chriscakesofmi.com` (should redirect to HTTPS)
   - Visit `https://chriscakesofmi.com` (should load site)
   - Visit `https://www.chriscakesofmi.com` (should redirect to root or load)
   - Test contact form submission

3. **Verify Cloudflare is Active**:
   - Open browser developer tools
   - Visit your site
   - Check Network tab
   - Look for response headers:
     ```
     cf-ray: xxxxx-xxx
     cf-cache-status: HIT or MISS
     server: cloudflare
     ```
   - If you see these headers, Cloudflare is proxying correctly!

4. **Test SSL Certificate**:
   - Visit https://www.ssllabs.com/ssltest/
   - Enter: `chriscakesofmi.com`
   - Run test
   - Should get an A or A+ rating

5. **Test Performance**:
   - Visit https://pagespeed.web.dev/
   - Enter: `https://chriscakesofmi.com`
   - Run test
   - Check Core Web Vitals scores

6. **Test Email** (if using domain email):
   - Send a test email to/from your domain email
   - Verify emails are still working
   - If broken, check MX records in Cloudflare DNS

### Step 12: Configure Resend with Custom Domain

Now that Cloudflare is managing DNS, add your domain to Resend:

1. **Go to Resend Dashboard**:
   - Navigate to Domains
   - Click "Add Domain"
   - Enter: `chriscakesofmi.com`

2. **Verify DNS Records**:
   - Resend will check the DNS records you added in Step 3
   - Should show green checkmarks for SPF, DKIM, DMARC
   - If not verified, wait for DNS propagation

3. **Update Environment Variables**:
   - In Vercel Dashboard → Settings → Environment Variables
   - Update `RESEND_FROM_EMAIL`:
     ```
     RESEND_FROM_EMAIL=noreply@chriscakesofmi.com
     ```
   - Redeploy your application

4. **Test Contact Form**:
   - Visit https://chriscakesofmi.com/contact
   - Submit a test inquiry
   - Verify email is received
   - Check "from" address shows `noreply@chriscakesofmi.com`

### Troubleshooting

#### Site Not Loading After Nameserver Change:

- **Wait for propagation**: Can take up to 24 hours
- **Check nameservers**: Use `dig NS chriscakesofmi.com`
- **Verify in Cloudflare**: Dashboard shows "Active" status
- **Clear browser cache**: Hard refresh (Ctrl+Shift+R)

#### SSL/TLS Errors:

- **Check Cloudflare SSL mode**: Should be "Full (strict)"
- **Verify Vercel SSL**: Vercel should show SSL certificate issued
- **Wait for SSL provisioning**: Can take 15-30 minutes
- **Check mixed content**: All assets should use HTTPS

#### 521 Error (Web Server is Down):

- **Issue**: Cloudflare can't connect to Vercel
- **Solution**:
  - Verify CNAME record points to `cname.vercel-dns.com`
  - Check proxy status is enabled (orange cloud)
  - Verify domain added in Vercel dashboard

#### 522 Error (Connection Timed Out):

- **Issue**: Vercel not responding
- **Solution**:
  - Check Vercel deployment status
  - Verify application is running
  - Check Vercel logs for errors

#### Email Stopped Working:

- **Issue**: MX records not configured correctly
- **Solution**:
  - Verify all MX records present in Cloudflare DNS
  - Ensure MX records are NOT proxied (gray cloud)
  - Check SPF record includes your email provider

#### Contact Form Emails Not Sending:

- **Check Resend domain verification**: All DNS records verified
- **Verify environment variables**: `RESEND_FROM_EMAIL` matches verified domain
- **Check Resend dashboard**: View email logs for errors
- **Test with different email**: Try alternative recipient

### Cloudflare Analytics and Monitoring

1. **View Traffic Analytics**:
   - Go to Analytics & Logs → Traffic
   - See requests, bandwidth, threats blocked
   - View geographic distribution of visitors

2. **Security Events**:
   - Go to Security → Events
   - See blocked threats
   - Review firewall rules triggered

3. **Performance Insights**:
   - View cache hit ratio
   - Check bandwidth savings
   - Monitor response times

### Maintenance and Updates

#### Regular Tasks:

1. **Weekly**:
   - Check Cloudflare Analytics for unusual traffic
   - Review security events for blocked threats

2. **Monthly**:
   - Review cache statistics
   - Check SSL certificate expiration (Cloudflare auto-renews)
   - Review and optimize Page Rules

3. **As Needed**:
   - Update DNS records when adding new services
   - Adjust caching rules based on performance
   - Review and update security settings

### Cost Summary

- **Cloudflare Free Tier**: $0/month
  - Unlimited requests
  - DDoS protection
  - SSL certificates
  - CDN caching
  - Basic analytics

- **Domain Registration**: $10-15/year (at your current registrar)
  - Keep domain at current registrar
  - Only update nameservers to Cloudflare

- **Total Additional Cost**: $0 (assuming you already own the domain)

## Google Analytics Setup (GA4)

Track website traffic, user behavior, and conversions with Google Analytics 4 (GA4). This guide covers setting up analytics for **chriscakesofmi.com** to help understand visitor engagement and optimize marketing efforts.

### Why Google Analytics?

- ✅ **Free forever** - Enterprise-grade analytics at no cost
- ✅ **User insights** - Understand where visitors come from and what they do
- ✅ **Page performance** - See which pages are most popular
- ✅ **Conversion tracking** - Track contact form submissions and events
- ✅ **Real-time data** - Monitor visitors in real-time
- ✅ **Mobile & desktop** - Unified tracking across all devices

### Step 1: Create Google Analytics Account

1. **Go to Google Analytics**:
   - Visit [https://analytics.google.com](https://analytics.google.com)
   - Sign in with your Google account (or create one)

2. **Click "Start measuring"** (if first time) or **"Admin"** (if you have existing properties)

3. **Create an Account**:
   - Click "Create Account" (if needed)
   - **Account name**: "ChrisCakes" or "ChrisCakes of Michigan"
   - **Account data sharing settings**: Enable recommended options
   - Click "Next"

### Step 2: Create GA4 Property

1. **Property Details**:
   - **Property name**: "ChrisCakes Website"
   - **Reporting time zone**: "United States / Eastern Time"
   - **Currency**: "US Dollar ($)"
   - Click "Next"

2. **Business Details**:
   - **Industry category**: "Food & Drink"
   - **Business size**: "Small" (1-10 employees)
   - Click "Next"

3. **Business Objectives**:
   - Select: ☑️ "Generate leads"
   - Select: ☑️ "Examine user behavior"
   - Click "Create"

4. **Accept Terms of Service**:
   - Check boxes to accept Google Analytics Terms of Service
   - Check GDPR acknowledgment (if applicable)
   - Click "I Accept"

### Step 3: Set Up Data Stream

1. **Choose Platform**:
   - Select **"Web"**

2. **Set Up Web Stream**:
   - **Website URL**: `https://chriscakesofmi.com`
   - **Stream name**: "ChrisCakes Website"
   - ☑️ **Enhanced measurement**: Enable (recommended - tracks scrolls, clicks, file downloads, video engagement)
   - Click "Create stream"

3. **Copy Measurement ID**:
   - You'll see a **Measurement ID** like: `G-XXXXXXXXXX`
   - **Copy this ID** - you'll need it for the next step
   - Keep this page open or save the ID securely

### Step 4: Install Google Analytics in Next.js

Now we'll add the tracking code to your Next.js application.

#### Option A: Using next/script (Recommended)

1. **Add Measurement ID to Environment Variables**:

   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

   Replace `G-XXXXXXXXXX` with your actual Measurement ID.

2. **Create Analytics Component**:

   Create a new file: `components/analytics/GoogleAnalytics.tsx`
   ```typescript
   'use client';

   import Script from 'next/script';

   export default function GoogleAnalytics() {
     const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

     if (!measurementId) {
       return null;
     }

     return (
       <>
         <Script
           src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
           strategy="afterInteractive"
         />
         <Script id="google-analytics" strategy="afterInteractive">
           {`
             window.dataLayer = window.dataLayer || [];
             function gtag(){dataLayer.push(arguments);}
             gtag('js', new Date());
             gtag('config', '${measurementId}', {
               page_path: window.location.pathname,
             });
           `}
         </Script>
       </>
     );
   }
   ```

3. **Add to Root Layout**:

   Edit `app/layout.tsx` and add the GoogleAnalytics component:
   ```typescript
   import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';

   export default function RootLayout({
     children,
   }: {
     children: React.ReactNode;
   }) {
     return (
       <html lang="en">
         <body>
           {children}
           <GoogleAnalytics />
         </body>
       </html>
     );
   }
   ```

4. **Add Environment Variable to Vercel**:

   In Vercel Dashboard:
   - Go to Settings → Environment Variables
   - Add:
     - **Name**: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
     - **Value**: `G-XXXXXXXXXX`
     - **Environment**: Production (and Preview if desired)
   - Click "Save"
   - Redeploy your application

#### Option B: Using Google Tag Manager (Advanced - Optional)

For more complex tracking needs, you can use Google Tag Manager instead:

1. **Create GTM Account**:
   - Go to [https://tagmanager.google.com](https://tagmanager.google.com)
   - Create a new account and container
   - Get the GTM container ID (e.g., `GTM-XXXXXXX`)

2. **Install GTM in Next.js**:
   - Similar to GA4, but use GTM script instead
   - Add GA4 tracking tag in GTM dashboard
   - Benefits: Can add multiple tracking tools without code changes

### Step 5: Track Contact Form Submissions (Conversions)

Track when users submit the contact form as a conversion event.

1. **Update Contact Form Component**:

   Edit `components/contact/ContactForm.tsx` to send events to GA4:
   ```typescript
   'use client';

   // Add this function at the top of the component
   const trackFormSubmission = () => {
     if (typeof window !== 'undefined' && window.gtag) {
       window.gtag('event', 'generate_lead', {
         event_category: 'Contact',
         event_label: 'Contact Form Submission',
         value: 1
       });
     }
   };

   // Inside your form submission handler, after successful submission:
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     // ... your existing form submission code ...

     if (response.success) {
       trackFormSubmission(); // Add this line
       // ... rest of your success handling ...
     }
   };
   ```

2. **Add TypeScript Types**:

   Create `types/gtag.d.ts`:
   ```typescript
   export {};

   declare global {
     interface Window {
       gtag: (
         command: 'config' | 'set' | 'event',
         targetId: string,
         config?: Record<string, unknown>
       ) => void;
       dataLayer: unknown[];
     }
   }
   ```

3. **Mark as Conversion in GA4**:
   - In GA4 dashboard, go to Admin → Events
   - Find "generate_lead" event (may take 24 hours to appear)
   - Toggle "Mark as conversion"
   - Now you can track lead generation!

### Step 6: Configure Enhanced Tracking (Optional)

Track additional user interactions beyond pageviews:

1. **Track Outbound Links**:
   ```typescript
   // Track when users click external links
   const trackOutboundLink = (url: string) => {
     if (typeof window !== 'undefined' && window.gtag) {
       window.gtag('event', 'click', {
         event_category: 'Outbound Link',
         event_label: url,
       });
     }
   };
   ```

2. **Track Phone Clicks**:
   ```typescript
   // Track when users click phone numbers
   const trackPhoneClick = () => {
     if (typeof window !== 'undefined' && window.gtag) {
       window.gtag('event', 'click', {
         event_category: 'Contact',
         event_label: 'Phone Number Click',
       });
     }
   };

   // Add to phone link in components
   <a href="tel:+1234567890" onClick={trackPhoneClick}>
     Call Us
   </a>
   ```

3. **Track Menu Category Selections**:
   ```typescript
   // In MenuDisplay component
   const trackCategoryFilter = (category: string) => {
     if (typeof window !== 'undefined' && window.gtag) {
       window.gtag('event', 'select_content', {
         content_type: 'menu_category',
         content_id: category,
       });
     }
   };
   ```

### Step 7: Verify Analytics is Working

1. **Real-Time Report**:
   - In GA4 dashboard, go to Reports → Real-time
   - Visit your website: `https://chriscakesofmi.com`
   - You should see yourself as an active user within 30 seconds
   - Check that pageviews are being recorded

2. **Test in Browser Console**:
   ```javascript
   // Open browser console and check:
   window.dataLayer
   // Should show array with tracking data

   window.gtag
   // Should show function definition
   ```

3. **Check Network Tab**:
   - Open DevTools → Network tab
   - Visit your site
   - Look for requests to `www.google-analytics.com/g/collect`
   - If you see these, tracking is working!

4. **Test Contact Form Conversion**:
   - Submit a test contact form
   - Go to GA4 → Reports → Real-time
   - Look for "generate_lead" event
   - Should appear within seconds

### Step 8: Configure Important Settings

#### Set Up Conversions:

1. **Navigate to Conversions**:
   - Admin → Events
   - Look for "generate_lead" event
   - Toggle "Mark as conversion"

2. **Create Custom Conversions** (Optional):
   - Track phone clicks as conversions
   - Track specific page visits (e.g., menu page)

#### Configure Data Retention:

1. **Set Data Retention Period**:
   - Admin → Data Settings → Data Retention
   - Set to **14 months** (maximum on free tier)
   - Enable "Reset user data on new activity"

#### Link to Google Search Console:

1. **Connect Search Console**:
   - Admin → Property Settings → Product Links
   - Click "Link" under Search Console
   - Select your verified Search Console property
   - Provides SEO insights alongside analytics

### Step 9: Privacy and Compliance

#### GDPR and Cookie Consent:

**Important**: If you have European visitors, you may need cookie consent.

1. **Add Cookie Consent Banner** (Optional but Recommended):

   Install a consent management library:
   ```bash
   npm install react-cookie-consent
   ```

   Create `components/analytics/CookieConsent.tsx`:
   ```typescript
   'use client';

   import CookieConsent from 'react-cookie-consent';

   export default function CookieBanner() {
     return (
       <CookieConsent
         location="bottom"
         buttonText="Accept"
         declineButtonText="Decline"
         enableDeclineButton
         cookieName="chriscakes-analytics-consent"
         style={{ background: '#2d2d2d' }}
         buttonStyle={{
           background: '#dc143c',
           color: '#fff',
           fontSize: '14px',
           borderRadius: '4px',
         }}
         declineButtonStyle={{
           background: '#666',
           color: '#fff',
           fontSize: '14px',
           borderRadius: '4px',
         }}
         expires={365}
         onAccept={() => {
           // Enable Google Analytics
           if (typeof window !== 'undefined' && window.gtag) {
             window.gtag('consent', 'update', {
               analytics_storage: 'granted',
             });
           }
         }}
         onDecline={() => {
           // Disable Google Analytics
           if (typeof window !== 'undefined' && window.gtag) {
             window.gtag('consent', 'update', {
               analytics_storage: 'denied',
             });
           }
         }}
       >
         This website uses cookies to enhance your browsing experience and analyze
         site traffic. By clicking "Accept", you consent to our use of cookies.
       </CookieConsent>
     );
   }
   ```

   Add to `app/layout.tsx`:
   ```typescript
   import CookieBanner from '@/components/analytics/CookieConsent';

   export default function RootLayout({ children }) {
     return (
       <html lang="en">
         <body>
           {children}
           <GoogleAnalytics />
           <CookieBanner />
         </body>
       </html>
     );
   }
   ```

2. **Add Privacy Policy Link**:
   - Update footer to include link to privacy policy
   - Create `/privacy-policy` page explaining data collection
   - Mention Google Analytics usage

3. **Configure GA4 for Privacy**:
   - Admin → Data Settings → Data Collection
   - Enable "Google signals data collection" (cross-device tracking)
   - Consider enabling "IP anonymization" for EU compliance

#### Exclude Your Own Traffic:

1. **Create Internal Traffic Filter**:
   - Admin → Data Streams → Web → Configure Tag Settings
   - Click "Show Advanced Settings" → "Define internal traffic"
   - Add your IP address or office IP range
   - Admin → Data Settings → Data Filters
   - Activate the "Internal Traffic" filter

### Step 10: Set Up Useful Reports

Configure custom reports for catering business insights:

#### 1. Contact Form Performance:

- **Reports → Engagement → Conversions**
- Track "generate_lead" conversion rate
- See which pages lead to most conversions

#### 2. Popular Menu Categories:

- **Reports → Engagement → Events**
- Filter by "select_content" events
- See which menu categories get the most views

#### 3. Geographic Data:

- **Reports → User → User Attributes → Demographics**
- See where visitors are located
- Helps target marketing to specific regions

#### 4. Traffic Sources:

- **Reports → Acquisition → Traffic Acquisition**
- See how users find your site (Google, social media, direct, referral)
- Optimize marketing based on best-performing channels

#### 5. Most Popular Pages:

- **Reports → Engagement → Pages and Screens**
- See which pages get the most views
- Identify popular services/menu items

### Key Metrics to Monitor

For a catering business, focus on these metrics:

1. **Conversions**: Contact form submissions
2. **Page Views**: Menu page, Services page, Contact page
3. **Traffic Sources**: Organic search, social media, referral
4. **Geographic Location**: Service area coverage
5. **Device Type**: Mobile vs. Desktop usage
6. **User Engagement**: Average session duration, pages per session
7. **Phone Clicks**: Track call-to-action performance

### Troubleshooting

#### Analytics Not Showing Data:

1. **Check Measurement ID**: Verify correct ID in environment variables
2. **Check Browser Console**: Look for JavaScript errors
3. **Ad Blockers**: Some users have ad blockers that prevent tracking
4. **Wait 24 hours**: Some reports take time to populate
5. **Check Real-time Report**: Should show immediate data

#### Events Not Tracking:

1. **Verify gtag function exists**: Check `window.gtag` in console
2. **Check event names**: Must match GA4 event naming conventions
3. **Test in Debug Mode**: Use GA4 DebugView (Admin → DebugView)
4. **Check network requests**: Look for `/collect` requests in DevTools

#### Low Data Volume:

- **Normal for new sites**: Takes time to build traffic
- **Check filters**: Make sure you're not filtering out all traffic
- **Verify tracking code**: Ensure it's on all pages

### Google Analytics 4 vs. Universal Analytics

**Note**: Universal Analytics (UA) was sunset on July 1, 2023. This guide uses GA4, the current version.

**Key Differences**:
- GA4 is event-based (vs. session-based in UA)
- Better cross-platform tracking (web + app)
- Machine learning insights
- Privacy-focused design
- Different report structure

### Integration with Google Ads (Optional)

If you plan to run Google Ads campaigns:

1. **Link Google Ads Account**:
   - Admin → Property Settings → Google Ads Links
   - Link your Google Ads account
   - Enables conversion tracking for ads

2. **Import Conversions**:
   - In Google Ads, import "generate_lead" conversion
   - Track ROI from ad campaigns
   - Optimize campaigns based on conversion data

### Alternative: Vercel Analytics

For simpler analytics focused on performance, consider **Vercel Analytics**:

```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Benefits**:
- Extremely lightweight
- Privacy-friendly (no cookies)
- Core Web Vitals tracking
- $0 for up to 100k pageviews/month

**Limitation**: Less detailed than GA4, mainly for performance tracking.

**Recommendation**: Use both! GA4 for user insights, Vercel Analytics for performance.

### Checklist

Before going live with analytics:

- [ ] GA4 property created with correct measurement ID
- [ ] Tracking code installed in Next.js app
- [ ] Environment variable set in Vercel
- [ ] Real-time report shows active users
- [ ] Contact form conversion tracking configured
- [ ] "generate_lead" marked as conversion
- [ ] Cookie consent banner added (if needed for GDPR)
- [ ] Privacy policy updated to mention analytics
- [ ] Internal traffic filter configured (exclude your own visits)
- [ ] Linked to Google Search Console (optional)
- [ ] Custom events tested (phone clicks, menu filters)

### Next Steps After Setup

1. **Week 1**: Monitor real-time reports, verify tracking works
2. **Week 2**: Check which pages are most popular
3. **Month 1**: Analyze traffic sources, optimize marketing
4. **Ongoing**: Review monthly reports, track conversions, adjust strategy

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
