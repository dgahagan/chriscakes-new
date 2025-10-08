import { groq } from 'next-sanity';

// Get all menu categories
export const menuCategoriesQuery = groq`*[_type == "menuCategory"] | order(order asc) {
  _id,
  title,
  slug,
  description,
  order,
  image
}`;

// Get all menu items
export const menuItemsQuery = groq`*[_type == "menuItem" && available == true] | order(order asc) {
  _id,
  name,
  slug,
  description,
  price,
  image,
  category->{
    _id,
    title,
    slug
  },
  featured,
  allergens
}`;

// Get menu items by category
export const menuItemsByCategoryQuery = groq`*[_type == "menuItem" && available == true && category->slug.current == $categorySlug] | order(order asc) {
  _id,
  name,
  slug,
  description,
  price,
  image,
  featured,
  allergens
}`;

// Get featured menu items
export const featuredMenuItemsQuery = groq`*[_type == "menuItem" && featured == true && available == true] | order(order asc) {
  _id,
  name,
  slug,
  description,
  price,
  image,
  category->{
    title,
    slug
  }
}`;

// Get site settings
export const siteSettingsQuery = groq`*[_type == "siteSettings"][0] {
  _id,
  title,
  description,
  phone,
  email,
  address,
  hours,
  socialMedia,
  logo
}`;

// Get page by slug
export const pageBySlugQuery = groq`*[_type == "page" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  content,
  seo
}`;

// Get all pages
export const allPagesQuery = groq`*[_type == "page"] {
  _id,
  title,
  slug
}`;
