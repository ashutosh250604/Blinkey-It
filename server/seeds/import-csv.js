import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import CategoryModel from '../models/category.model.js';
import SubCategoryModel from '../models/subCategory.model.js';
import ProductModel from '../models/product.model.js';
import connectDB from '../config/connectDB.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import CSV and convert to products
const importCSV = async (csvFileName) => {
  try {
    console.log(`📄 Reading CSV file: ${csvFileName}\n`);

    // Read CSV file
    const csvFilePath = path.join(__dirname, csvFileName);
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
    
    // Parse CSV
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    console.log(`✅ Found ${records.length} products in CSV\n`);

    // Connect to DB
    await connectDB();

    // Fetch all categories and subcategories
    const allCategories = await CategoryModel.find();
    const allSubCategories = await SubCategoryModel.find();

    const categoryMap = new Map(
      allCategories.map(cat => [cat.name, cat])
    );
    const subCategoryMap = new Map(
      allSubCategories.map(sub => [sub.name, sub])
    );

    console.log('📦 Processing products...\n');

    // Process each product
    const productsToInsert = [];
    let skipped = 0;

    for (const record of records) {
      const category = categoryMap.get(record.categoryName);
      const subCategory = subCategoryMap.get(record.subCategoryName);

      if (!category) {
        console.warn(`⚠️  Skipping "${record.name}": Category "${record.categoryName}" not found`);
        skipped++;
        continue;
      }

      if (!subCategory) {
        console.warn(`⚠️  Skipping "${record.name}": SubCategory "${record.subCategoryName}" not found`);
        skipped++;
        continue;
      }

      // Build image array
      const images = [];
      if (record.image1) images.push(record.image1);
      if (record.image2) images.push(record.image2);
      if (record.image3) images.push(record.image3);
      if (record.image4) images.push(record.image4);

      // Build more_details object
      const more_details = {};
      if (record.brand) more_details.brand = record.brand;
      if (record.origin) more_details.origin = record.origin;
      if (record.shelf_life) more_details.shelf_life = record.shelf_life;
      if (record.type) more_details.type = record.type;

      productsToInsert.push({
        name: record.name,
        image: images,
        category: [category._id],
        subCategory: [subCategory._id],
        unit: record.unit || '1 unit',
        stock: parseInt(record.stock) || 0,
        price: parseFloat(record.price) || 0,
        discount: parseFloat(record.discount) || 0,
        description: record.description || '',
        more_details: more_details,
        publish: record.publish === 'false' ? false : true
      });
    }

    console.log(`\n📊 Ready to import:`);
    console.log(`   - Valid products: ${productsToInsert.length}`);
    console.log(`   - Skipped: ${skipped}\n`);

    if (productsToInsert.length > 0) {
      const result = await ProductModel.insertMany(productsToInsert);
      console.log(`✅ Successfully imported ${result.length} products!`);
    } else {
      console.log('❌ No valid products to import');
    }

    process.exit(0);
  } catch (error) {
    console.error('💥 Error importing CSV:', error);
    process.exit(1);
  }
};

// Get CSV filename from command line
const csvFile = process.argv[2] || 'products-template.csv';
importCSV(csvFile);
