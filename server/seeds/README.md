# 🌱 Database Seeder

Bulk import categories, subcategories, and products into your MongoDB database.

## 🚀 Quick Start

### Import All Data
```bash
cd server
npm run seed
```

### Delete All Data
```bash
npm run seed:destroy
```

## 📁 Files

- **`categories.json`** - 20 main categories
- **`subcategories.json`** - 28 subcategories linked to categories  
- **`products.json`** - 20 sample products with pricing, stock, images
- **`seeder.js`** - Script to import/delete data

## ✏️ Customizing Data

### 1. Edit JSON Files

**Categories** ([categories.json](categories.json)):
```json
{
  "name": "Your Category Name",
  "image": "https://your-image-url.com/image.jpg"
}
```

**SubCategories** ([subcategories.json](subcategories.json)):
```json
{
  "name": "Your SubCategory Name",
  "image": "https://your-image-url.com/image.jpg",
  "categoryName": "Parent Category Name"
}
```

**Products** ([products.json](products.json)):
```json
{
  "name": "Product Name",
  "image": ["https://image1.jpg", "https://image2.jpg"],
  "categoryName": "Category Name",
  "subCategoryName": "SubCategory Name",
  "unit": "1 kg",
  "stock": 100,
  "price": 299,
  "discount": 10,
  "description": "Product description",
  "more_details": {
    "brand": "Brand Name",
    "origin": "Location"
  },
  "publish": true
}
```

### 2. Upload Your Images

**Option A: Use Cloudinary** (Recommended)
1. Go to [cloudinary.com](https://cloudinary.com)
2. Upload your images
3. Copy the image URLs
4. Replace placeholder URLs in JSON files

**Option B: Use Placeholder Service**
```
https://via.placeholder.com/400x400.png?text=Product+Name
```

### 3. Run Seeder
```bash
npm run seed
```

## 📊 What Gets Imported

| Type | Count | Fields |
|------|-------|--------|
| **Categories** | 20 | name, image |
| **SubCategories** | 28 | name, image, category reference |
| **Products** | 20 | name, images, category/subcategory refs, unit, stock, price, discount, description, details |

## 🔄 Re-seeding

To clear and re-import data:
```bash
npm run seed:destroy  # Clear all
npm run seed          # Import fresh data
```

## ⚠️ Important Notes

1. **Seeder deletes existing data** before importing
2. Make sure your `.env` has correct `MONGODB_URI`
3. Image URLs should be publicly accessible
4. Category/SubCategory names must match exactly between files
5. Run from `server` directory only

## 🎨 Image Recommendations

- **Format:** JPG, PNG, WebP
- **Size:** 400x400px minimum
- **Categories:** Simple icons/illustrations
- **Products:** Clear product photos with white background
- **File size:** < 500KB per image

## 🔧 Troubleshooting

**"Category not found" warning:**
- Check spelling of `categoryName` in subcategories/products
- Must match exactly with category `name`

**"SubCategory not found" warning:**
- Check spelling of `subCategoryName` in products
- Must match exactly with subcategory `name`

**Connection errors:**
- Verify `MONGODB_URI` in `.env`
- Check database is accessible

## 📝 Adding More Data

1. Add entries to JSON files
2. Follow the exact structure
3. Run `npm run seed` again

That's it! Your database will be populated in seconds instead of manual entry.
