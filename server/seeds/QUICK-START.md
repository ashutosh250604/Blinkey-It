# 🎯 Quick Reference - Product Import

## Commands
```bash
cd server

# Import everything (wipes old data)
npm run seed

# Delete all
npm run seed:destroy  

# Import from CSV
npm run import:csv products-template.csv
```

## Files to Edit

### Add Products: `seeds/products.json`
```json
{
  "name": "Product Name",
  "image": ["https://url.jpg"],
  "categoryName": "Snacks & Munchies",
  "subCategoryName": "Chips & Crisps",
  "unit": "100 g",
  "stock": 150,
  "price": 50,
  "discount": 10,
  "description": "Description",
  "more_details": {"brand": "Brand"},
  "publish": true
}
```

### Add Categories: `seeds/categories.json`
```json
{
  "name": "New Category",
  "image": "https://url.jpg"
}
```

### Add SubCategories: `seeds/subcategories.json`
```json
{
  "name": "New SubCategory",
  "image": "https://url.jpg",
  "categoryName": "Parent Category"
}
```

## Current Data
- ✅ 20 Categories
- ✅ 28 SubCategories  
- ✅ 20 Products

## CSV Template Columns
```
name | image1 | image2 | categoryName | subCategoryName | unit | stock | price | discount | description | brand | origin
```

## Tips
1. Category/SubCategory names must match EXACTLY
2. Images need public URLs (Cloudinary recommended)
3. Test with 5 products first
4. Keep master CSV file for future updates
5. Use Excel formulas for bulk image URLs

## Docs
- Full guide: `seeds/BULK-IMPORT-GUIDE.md`
- Seeder docs: `seeds/README.md`
