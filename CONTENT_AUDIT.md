# ChrisCakes Website - Content Audit

## Site Overview
ChrisCakes is a Michigan-based catering company specializing in pancake breakfasts and other catering services. The current site is built using ASP.NET MVC and contains static HTML content.

## Pages Identified

### 1. Home (Index.cshtml)
**Content Type**: Marketing/Information page
**Key Content**:
- Main headline: "Chris Cakes is the catering company that makes pancakes... BY THE MILLIONS!"
- Company history (since 1969, Guinness World Records)
- Service description (custom grill, pancake flipping show)
- Service areas (entire Michigan state)
- YouTube video embed
- Customer testimonials
- Photo gallery (home1.png through home6.png)

**Editable Content Needed**:
- Headline text
- About paragraphs (5 paragraphs)
- Video URL
- Customer testimonials (quote + attribution)
- Gallery images

---

### 2. About (About.cshtml)
**Content Type**: Contact/Information page
**Expected Content**: Contact information, company background

---

### 3. Services (Services.cshtml)
**Content Type**: Service offerings page
**Expected Content**: Description of catering services
**Images**: services1.jpg, services2.jpg, services3.jpg

---

### 4. Breakfast Menus (BreakfastMenus.cshtml)
**Content Type**: Menu page
**Menu Items Identified**:

1. **Easy Breezy**
   - Description: "Scrambled eggs served with bagels and cream cheese complete with a fresh fruit yogurt and granola parfait and Tang. Includes paper goods and cutlery."
   - Price: Call for pricing

2. **Cakes & Eggs**
   - Description: "Unlimited Pancakes served with sausage links, scrambled eggs, margarine, syrup, sugar free syrup and Tang. Includes paper goods and cutlery."
   - Price: Call for pricing

3. **Top Cake**
   - Description: "Unlimited Pancakes served with sausage links. Topping bar includes your choice of 2 fruits, chocolate chips, sprinkles, whipped cream and Tang. Includes margarine, syrup, sugar free syrup, paper goods and cutlery."
   - Price: Call for pricing

4. **Chris Cakes Deluxe**
   - Description: "Unlimited Pancakes served with scrambled eggs, sausage links, hash browns and Tang. Includes margarine, syrup, sugar free syrup, paper goods and cutlery."
   - Price: Call for pricing

5. **Big Chris**
   - Description: "Unlimited Pancakes served with two meat choices, scrambled eggs, hash browns, and Tang. Includes margarine, syrup, sugar free syrup, paper products and cutlery."
   - Price: Call for pricing

6. **French Toast Lite**
   - Description: "French Toast served with sausage links, margarine, syrup and sugar free syrup and Tang. Includes paper goods and cutlery."
   - Price: Call for pricing

7. **French Toast N Eggs**
   - Description: "Handmade golden French toast served with scrambled eggs, sausage links and Tang. Includes syrup, margarine and sugar free syrup, paper goods and cutlery."
   - Price: Call for pricing

8. **Biscuits 'N Gravy**
   - Description: "Tasty hot biscuits with sausage gravy served with scrambled eggs and Tang. Includes paper goods and cutlery."
   - Price: Call for pricing

**Additional Content**:
- Customer testimonial: "PEOPLE LOVE US… CAUSE WE ARE FLIPPING AWESOME." with quote from Noelle Davis, West Maple Elementary School

---

### 5. Breakfast A La Carte (BreakfastALaCarte.cshtml)
**Content Type**: Menu page
**Expected Content**: Individual breakfast items with pricing

---

### 6. Lunch and Dinner (LunchAndDinner.cshtml)
**Content Type**: Menu page
**Expected Content**: Lunch/dinner menu items and packages

---

### 7. Menus N More (MenusNMore.cshtml)
**Content Type**: Menu page
**Expected Content**: Additional menu options

---

### 8. Menus N More A La Carte (MenusNMoreALaCarte.cshtml)
**Content Type**: Menu page
**Expected Content**: Individual items from Menus N More

---

### 9. Fundraising (Fundraising.cshtml)
**Content Type**: Information page
**Expected Content**: Fundraising event information
**Images**: fundraising1.jpg, fundraising2.jpg.png, fundraising3.jpg.png

---

### 10. How To Book (HowToBook.cshtml)
**Content Type**: Information/Process page
**Expected Content**: Booking process and instructions
**Images**: book1.jpg, book2.jpg

---

### 11. How To Run A Successful Fundraiser (HowToRunASuccessfulFundraiser.cshtml)
**Content Type**: Information/Guide page
**Expected Content**: Tips and guidelines for fundraisers
**Images**: help1.jpg, help1.png, help2.jpg, help3.jpg, howto1.jpg

---

### 12. Day Of Event Information (DayOfEventInformation.cshtml)
**Content Type**: Information page
**Expected Content**: Day-of logistics and requirements
**Images**: day1.jpg through day6.jpg

---

### 13. Your Group (YourGroup.cshtml)
**Content Type**: Information page
**Expected Content**: Information for groups/organizations

---

### 14. Invoice Payment (InvoicePayment.cshtml)
**Content Type**: Functional page
**Expected Content**: Payment processing form
**Images**: invoice1.jpg through invoice4.jpg

---

## Menu Categories Identified

Based on page structure, the following menu categories exist:

1. **Breakfast Menus** - Full breakfast packages
2. **Breakfast A La Carte** - Individual breakfast items
3. **Lunch & Dinner** - Lunch/dinner packages
4. **Menus N More** - Additional menu options
5. **Menus N More A La Carte** - Individual additional items

---

## Image Assets

### Logo
- `logo.png` - Company logo

### Home Page Images
- `banner1.png` - Main banner
- `home1.png` through `home6.png` - Gallery images

### Category/Section Images
- **Services**: services1-3.jpg
- **Booking**: book1-2.jpg
- **Fundraising**: fundraising1-3.jpg/png
- **Help/How-To**: help1-3.jpg, howto1.jpg
- **Day Of Event**: day1-6.jpg
- **Invoice**: invoice1-4.jpg

---

## Content Management Requirements

### High Priority (Frequently Updated)
1. **Menu Items** - Names, descriptions, prices
2. **Menu Categories** - Category names, descriptions
3. **Testimonials** - Customer quotes and attributions
4. **Photos** - Event photos, food photos

### Medium Priority (Occasionally Updated)
5. **Page Content** - About, Services, How-To pages
6. **Contact Information** - Phone, email, address, hours
7. **Social Media Links** - Facebook, Instagram, etc.

### Low Priority (Rarely Updated)
8. **Logo** - Company logo
9. **Site Settings** - Site title, meta descriptions

---

## Recommended Content Schema Updates

Based on the audit, consider these additions to the schema:

### Menu Item Schema - Additional Fields
- `package` (boolean) - Is this a package or single item?
- `servingSize` (string) - e.g., "Serves 50-100 people"
- `minimumGuests` (number) - Minimum number of guests

### Testimonial Schema (New)
```typescript
{
  name: 'testimonial',
  fields: [
    'quote' (text),
    'author' (string),
    'authorTitle' (string),
    'organization' (string),
    'featured' (boolean),
    'displayOrder' (number)
  ]
}
```

### Gallery Schema (New)
```typescript
{
  name: 'gallery',
  fields: [
    'title' (string),
    'images' (array of images),
    'category' (reference to category),
    'displayOnHome' (boolean)
  ]
}
```

---

## Migration Checklist

- [ ] Extract all menu items from Breakfast Menus page (8 items)
- [ ] Extract all menu items from Breakfast A La Carte page
- [ ] Extract all menu items from Lunch and Dinner page
- [ ] Extract all menu items from Menus N More pages
- [ ] Copy and optimize all images (30+ images)
- [ ] Extract testimonials from various pages
- [ ] Extract contact information
- [ ] Extract all static page content (About, Services, etc.)
- [ ] Create menu categories
- [ ] Upload logo

---

## Design Notes

The current site uses:
- Bootstrap framework (responsive design)
- Lightbox for image galleries
- YouTube iframe embeds
- Customer testimonial callouts
- Breadcrumb navigation
- Call-to-action buttons

These design patterns should be replicated in the new Next.js site.

---

## Technical Stack (Current Site)
- **Framework**: ASP.NET MVC (.NET Framework)
- **Frontend**: Bootstrap 3/4, jQuery
- **Language**: C# with Razor views
- **Structure**: Traditional MVC pattern

---

**Audit Date**: 2025-10-08
**Status**: Complete
