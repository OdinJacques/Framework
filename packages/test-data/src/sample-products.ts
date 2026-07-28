/**
 * Known products on automationexercise.com (verified against GET /api/productsList),
 * used directly by the web suite (visibility in the storefront UI), the API suite
 * (presence in /productsList and /searchProduct), and the SQL suite (seeded rows in
 * apps/sql/db/seed.ts) so a catalog change on the live site is traceable across all three.
 *
 * automationexercise.com is a real third-party site whose catalog (and UI/API copy
 * generally — e.g. exact error text) can change; if these fall out of date, refresh
 * the values from the live site. This is an accepted risk of testing a real third-party
 * site, not something the framework tries to eliminate.
 */
export const sampleProducts = [
  { id: 1, name: 'Blue Top', price: 'Rs. 500', brand: 'Polo', userType: 'Women', category: 'Tops' },
  { id: 2, name: 'Men Tshirt', price: 'Rs. 400', brand: 'H&M', userType: 'Men', category: 'Tshirts' },
  {
    id: 3,
    name: 'Sleeveless Dress',
    price: 'Rs. 1000',
    brand: 'Madame',
    userType: 'Women',
    category: 'Dress',
  },
] as const;
