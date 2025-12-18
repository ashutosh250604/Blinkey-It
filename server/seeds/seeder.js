import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import CategoryModel from '../models/category.model.js';
import SubCategoryModel from '../models/subCategory.model.js';
import ProductModel from '../models/product.model.js';
import connectDB from '../config/connectDB.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import data
const categories = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'categories.json'), 'utf-8')
);
const subcategories = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'subcategories.json'), 'utf-8')
);
const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'products.json'), 'utf-8')
);

// Seed Categories
const seedCategories = async () => {
  try {
    await CategoryModel.deleteMany();
    const createdCategories = await CategoryModel.insertMany(categories);
    console.log(`✅ ${createdCategories.length} Categories imported successfully`);
    return createdCategories;
  } catch (error) {
    console.error('❌ Error importing categories:', error);
    throw error;
  }
};

// Seed SubCategories
const seedSubCategories = async (categoryMap) => {
  try {
    await SubCategoryModel.deleteMany();
    
    const subCategoriesWithRefs = subcategories.map(sub => {
      const category = categoryMap.get(sub.categoryName);
      if (!category) {
        console.warn(`⚠️  Category "${sub.categoryName}" not found for subcategory "${sub.name}"`);
      }
      return {
        name: sub.name,
        image: sub.image,
        category: category ? [category._id] : []
      };
    });

    const createdSubCategories = await SubCategoryModel.insertMany(subCategoriesWithRefs);
    console.log(`✅ ${createdSubCategories.length} SubCategories imported successfully`);
    return createdSubCategories;
  } catch (error) {
    console.error('❌ Error importing subcategories:', error);
    throw error;
  }
};

// Seed Products
const seedProducts = async (categoryMap, subCategoryMap) => {
  try {
    await ProductModel.deleteMany();
    
    const productsWithRefs = products.map(prod => {
      const category = categoryMap.get(prod.categoryName);
      const subCategory = subCategoryMap.get(prod.subCategoryName);
      
      if (!category) {
        console.warn(`⚠️  Category "${prod.categoryName}" not found for product "${prod.name}"`);
      }
      if (!subCategory) {
        console.warn(`⚠️  SubCategory "${prod.subCategoryName}" not found for product "${prod.name}"`);
      }

      return {
        name: prod.name,
        image: prod.image,
        category: category ? [category._id] : [],
        subCategory: subCategory ? [subCategory._id] : [],
        unit: prod.unit,
        stock: prod.stock,
        price: prod.price,
        discount: prod.discount,
        description: prod.description,
        more_details: prod.more_details,
        publish: prod.publish
      };
    });

    const createdProducts = await ProductModel.insertMany(productsWithRefs);
    console.log(`✅ ${createdProducts.length} Products imported successfully`);
    return createdProducts;
  } catch (error) {
    console.error('❌ Error importing products:', error);
    throw error;
  }
};

// Main seeder function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to database
    await connectDB();

    // Seed categories
    console.log('📦 Importing Categories...');
    const createdCategories = await seedCategories();
    const categoryMap = new Map(
      createdCategories.map(cat => [cat.name, cat])
    );

    // Seed subcategories
    console.log('\n📦 Importing SubCategories...');
    const createdSubCategories = await seedSubCategories(categoryMap);
    const subCategoryMap = new Map(
      createdSubCategories.map(sub => [sub.name, sub])
    );

    // Seed products
    console.log('\n📦 Importing Products...');
    await seedProducts(categoryMap, subCategoryMap);

    console.log('\n✨ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Categories: ${createdCategories.length}`);
    console.log(`   - SubCategories: ${createdSubCategories.length}`);
    console.log(`   - Products: ${products.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('\n💥 Seeding failed:', error);
    process.exit(1);
  }
};

// Destroy data function
const destroyData = async () => {
  try {
    console.log('🗑️  Destroying all data...\n');
    
    await connectDB();
    
    await ProductModel.deleteMany();
    console.log('✅ Products destroyed');
    
    await SubCategoryModel.deleteMany();
    console.log('✅ SubCategories destroyed');
    
    await CategoryModel.deleteMany();
    console.log('✅ Categories destroyed');

    console.log('\n✨ All data destroyed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n💥 Error destroying data:', error);
    process.exit(1);
  }
};

// Check command line arguments
if (process.argv[2] === '-d') {
  destroyData();
} else {
  seedDatabase();
}
