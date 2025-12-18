# 🚀 Bulk Product Import Guide

Stop manually adding products one-by-one! Import hundreds of products in seconds.

---

## ✅ What You Have Now

Your database is already populated with:
- ✅ **20 Categories** (Fruits & Vegetables, Dairy, Snacks, etc.)
- ✅ **28 SubCategories** (Fresh Vegetables, Milk, Chips, etc.)  
- ✅ **20 Sample Products** (with prices, stock, images)

---

## 🎯 3 Ways to Add More Products

### **Method 1: Edit JSON Files** (Recommended for bulk)

1. Open [server/seeds/products.json](server/seeds/products.json)
2. Copy-paste this template and modify:

```json
{
  "name": "Your Product Name",
  "image": ["https://image-url.jpg"],
  "categoryName": "Snacks & Munchies",
  "subCategoryName": "Chips & Crisps",
  "unit": "100 g",
  "stock": 150,
  "price": 50,
  "discount": 10,
  "description": "Your product description",
  "more_details": {
    "brand": "Brand Name"
  },
  "publish": true
}
```

3. Run: `npm run seed`

### **Method 2: Import from Excel/CSV** (For spreadsheet users)

1. Open [server/seeds/products-template.csv](server/seeds/products-template.csv) in Excel/Google Sheets
2. Add your products (fill the columns):

| name | image1 | categoryName | subCategoryName | unit | stock | price | discount |
|------|--------|--------------|-----------------|------|-------|-------|----------|
| Tata Salt | https://... | Masala, Oil & More | Salt & Sugar | 1 kg | 500 | 22 | 0 |

3. Save as CSV
4. Run: `npm run import:csv products-template.csv`

### **Method 3: API Bulk Import** (For developers)

Create a script to POST multiple products:

```javascript
const products = [...]; // Your products array

for (const product of products) {
  await axios.post('/api/product/create-product', product);
}
```

---

## 📋 Complete Commands Reference

```bash
# Navigate to server directory
cd "C:\Users\Devyani\Projects\Blinkey It\server"

# Import all (categories + subcategories + products)
npm run seed

# Delete all data
npm run seed:destroy

# Import products from CSV
npm run import:csv your-file.csv

# Import with default template
npm run import:csv
```

---

## 🎨 Image URLs - Quick Options

### **Option 1: Cloudinary (Recommended)**
```
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/folder/image.jpg
```

### **Option 2: Your existing Images Upload folder**
Upload images to Cloudinary, then use URLs in JSON/CSV

### **Option 3: Placeholder for testing**
```
https://via.placeholder.com/400x400.png?text=Product+Name
```

### **Option 4: Real product images**
- Download from Google Images (commercial use)
- Use [Unsplash](https://unsplash.com) free images
- Take photos with your phone

---

## 📝 Product Fields Explained

| Field | Required | Example | Description |
|-------|----------|---------|-------------|
| `name` | ✅ | "Amul Gold Milk" | Product display name |
| `image` | ✅ | ["url1", "url2"] | Array of image URLs |
| `categoryName` | ✅ | "Dairy, Bread & Eggs" | Must match existing category |
| `subCategoryName` | ✅ | "Milk" | Must match existing subcategory |
| `unit` | ✅ | "1 L", "500 g" | Unit of measurement |
| `stock` | ✅ | 150 | Available quantity |
| `price` | ✅ | 66 | Price in rupees |
| `discount` | ❌ | 10 | Discount percentage (0-100) |
| `description` | ❌ | "Fresh milk" | Product description |
| `more_details` | ❌ | `{"brand": "Amul"}` | Additional info object |
| `publish` | ❌ | true | Show on website (default: true) |

---

## 🔍 Available Categories & SubCategories

Run this to see what's in your database:

```javascript
// In your browser console (after login as admin)
const categories = await fetch('/api/category/get-category').then(r => r.json());
console.table(categories.data);

const subcategories = await fetch('/api/subcategory/get-subcategory').then(r => r.json());
console.table(subcategories.data);
```

Or check the JSON files:
- [seeds/categories.json](seeds/categories.json) - 20 categories
- [seeds/subcategories.json](seeds/subcategories.json) - 28 subcategories

---

## 💡 Pro Tips

### 1. **Batch Process Images**
Upload 100 images at once to Cloudinary, get all URLs, paste into CSV

### 2. **Use Excel Formulas**
```excel
="https://mycdn.com/products/" & A2 & ".jpg"
```

### 3. **Test with Small Batch First**
Add 5-10 products first, verify, then import hundreds

### 4. **Keep Master Spreadsheet**
Maintain products in Google Sheets, export CSV when ready

### 5. **Name Matching is Exact**
- ❌ "Snacks & munchies" (lowercase)
- ✅ "Snacks & Munchies" (exact match)

---

## ⚠️ Common Issues & Fixes

### "Category not found"
**Fix:** Check spelling in [categories.json](categories.json)
```
CategoryName in products.json must match name in categories.json exactly
```

### "SubCategory not found"  
**Fix:** Check spelling in [subcategories.json](subcategories.json)

### "Cannot find module csv-parse"
**Fix:** Run `npm install csv-parse`

### Images not showing
**Fix:** Ensure URLs are:
- Publicly accessible (not localhost)
- Direct image links (end with .jpg/.png)
- Using HTTPS

---

## 📊 Example: Import 100 Products in 2 Minutes

1. **Download** [products-template.csv](products-template.csv)
2. **Open in Google Sheets**
3. **Fill 100 rows** with your products
4. **Export as CSV**
5. **Save to** `server/seeds/my-products.csv`
6. **Run:** `npm run import:csv my-products.csv`
7. **Done!** ✨

---

## 🎓 Full Workflow Example

```bash
# Step 1: Check what you have
npm run seed

# Step 2: Add your products to CSV
# Edit: server/seeds/my-products.csv

# Step 3: Import new products
npm run import:csv my-products.csv

# Step 4: Start server and verify
npm run dev
```

---

## 🆘 Need Help?

**Q: Can I add new categories?**  
A: Yes! Edit `seeds/categories.json`, add your category, run `npm run seed`

**Q: Can I update existing products?**  
A: Products are inserted, not updated. Delete with `npm run seed:destroy` first.

**Q: What if I have 1000 products?**  
A: CSV method is perfect! Excel → Export CSV → Import in seconds.

**Q: Can I import from my existing database?**  
A: Export as CSV with matching columns, then use `npm run import:csv`

---

## 🎉 You're Ready!

No more manual entry! Just edit JSON/CSV files and import in seconds.

**Next Steps:**
1. Replace placeholder images with real product photos
2. Adjust prices and stock levels
3. Add more products using CSV import
4. Test checkout flow with new products

Happy importing! 🚀
