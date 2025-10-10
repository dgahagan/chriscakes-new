# Editing Website Pages

This guide explains how to update content on your website's main pages like "About Us," "Services," and other informational pages.

## Important: Pages Are Currently Hard-Coded

**Please note**: Unlike your menu items, categories, testimonials, and site settings, the main website pages (About, Services, Fundraising, How to Book, etc.) are **currently hard-coded** into the website and **cannot be edited through the Sanity Studio**.

This means you'll need developer assistance to make changes to these pages.

## What You CAN Edit Without a Developer

The following content is fully manageable through the Sanity Studio:

✅ **Menu Items** - Add, edit, remove items, change prices, upload photos
✅ **Menu Categories** - Organize your menu sections
✅ **Testimonials** - Add and manage customer reviews
✅ **Site Settings** - Update phone, email, hours, address, social media
✅ **FAQs** - Add and edit frequently asked questions (displayed on Services page)

See the relevant guides for each of these features.

## What Requires Developer Help

The following pages are hard-coded and need developer assistance to update:

❌ **About Page** (`/about`) - Company history, story, achievements
❌ **Services Page** (`/services`) - Service descriptions, images
❌ **Fundraising Page** (`/fundraising`) - Fundraising information
❌ **How to Book Page** (`/how-to-book`) - Booking instructions
❌ **Day of Event Page** (`/day-of-event`) - Event day information
❌ **Volunteers Page** (`/volunteers`) - Volunteer information
❌ **Invoice Payment Page** (`/invoice-payment`) - Payment information
❌ **Fundraising Tips Page** (`/fundraising-tips`) - Tips and advice

## How to Request Page Updates

When you need to update content on one of these pages:

### Step 1: Identify What Needs to Change
- Which page? (About, Services, Fundraising, etc.)
- What section of the page?
- What is the current text?
- What should it say instead?

### Step 2: Prepare Your Content
Write out the exact text you want on the page. For example:

```
Page: About Us
Section: Our Story (second paragraph)
Current text: "We use a custom designed grill..."
New text: "We use our custom designed grill and dispensing system that allows us to serve groups of any size efficiently..."
```

### Step 3: Contact Your Developer
Send your requested changes to your web developer or site administrator with:
- The page name
- The specific section
- The new content (and any images if applicable)
- Deadline if time-sensitive

## Why Aren't Pages Editable?

The Sanity CMS includes a "Page" content type that *could* be used for dynamic page content, but the current website implementation uses hard-coded pages for better performance and simpler maintenance of the current content structure.

**Future Enhancement**: The website could be updated to make pages editable through Sanity, but this would require developer work to:
1. Create page content in Sanity
2. Update the Next.js pages to fetch from Sanity
3. Migrate existing content
4. Test thoroughly

If you frequently need to update page content and would like this feature, discuss it with your developer.

## FAQs Are Editable!

One exception: The **Services page** displays FAQs at the bottom, and these **ARE editable** through Sanity Studio!

### To Edit FAQs:
1. Go to **www.chriscakesofmi.com/studio**
2. Click **"FAQs"** in the left menu
3. Add, edit, or remove FAQ items
4. Click **"Publish"**
5. Wait 60 seconds and refresh the Services page

FAQs appear automatically on the Services page in the order you specify.

## Content You Should Update Regularly

Focus your energy on the content you *can* manage yourself:

### Menu Items
Keep your menu fresh and up-to-date:
- Update prices as needed
- Add seasonal specials
- Mark items as unavailable when needed
- Upload appetizing photos

### Testimonials
Regularly add new customer reviews:
- After each successful event, ask for feedback
- Add 1-2 new testimonials per month
- Feature your best reviews

### Site Settings
Keep your contact information current:
- Phone number
- Email address
- Business hours
- Social media links

### FAQs
Update common questions:
- Add new questions customers frequently ask
- Update answers when policies change
- Remove outdated questions

## When to Contact Your Developer

You should reach out to your developer when:

### Content Changes
- Updating text on About, Services, or other main pages
- Adding or removing entire pages
- Changing navigation menu items
- Major content restructuring

### Design Changes
- Changing colors or fonts
- Modifying layout or structure
- Adding new sections or features
- Mobile responsiveness issues

### Technical Issues
- Something is broken or not displaying correctly
- Images aren't loading properly
- Forms aren't working
- Website is slow or has errors

### Feature Requests
- Adding new functionality
- Integrating with other services
- Custom forms or calculators
- Advanced features

## Tips for Working With Your Developer

### Be Specific
Instead of: "Can you update the About page?"
Say: "Can you update the About page, 'Our Story' section, second paragraph, to say: [exact new text]"

### Provide Complete Content
- Write all the text you want
- Gather all images beforehand
- Specify exactly where things should go
- Include links if needed

### Be Realistic About Timing
- Simple text changes: Usually quick (hours to 1 day)
- New sections or features: May take days or weeks
- Major overhauls: Could take weeks or months

### Batch Your Requests
If possible, group multiple changes together:
- All About page updates at once
- All Services page updates at once
- This is more efficient than many small requests

## Summary

**What You Control:**
- Menu items and categories (fully editable)
- Testimonials (fully editable)
- Site settings (fully editable)
- FAQs (fully editable)

**What Requires Developer:**
- Main page content (About, Services, etc.)
- New pages or navigation changes
- Design and layout changes
- New features or functionality

By focusing on what you *can* update yourself (menus, testimonials, settings), you can keep your site fresh and current. For larger content changes to main pages, work with your developer to implement those updates.

---

**Related Guides**:
- [Managing Menu Items](./managing-menu-items.md) - What you CAN edit yourself
- [Managing Testimonials](./managing-testimonials.md) - Keep reviews current
- [Updating Site Settings](./updating-site-settings.md) - Contact info you control
- [Getting Started](./GETTING_STARTED.md) - Back to the basics
