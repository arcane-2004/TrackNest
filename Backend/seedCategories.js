const categoryModel = require("./models/category.model");
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

const defaultCategories = [
	{ name: "Food", icon: "🍔", type: "expense", color: "#ef4444" },
	{ name: "Transport", icon: "🚌", type: "expense", color: "#3b82f6" },
	{ name: "Shopping", icon: "🛍️", type: "expense", color: "#8b5cf6" },
	{ name: "Bills", icon: "💡", type: "expense", color: "#f59e0b" },
	{ name: "Salary", icon: "💰", type: "income", color: "#10b981" },
	{ name: "Refund", icon: "💲", type: "income", color: "F54927" },
	{ name: "Interest", icon: "💳", type: "income", color: "#09C8B1" },
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    // console.log("✅ Connected to MongoDB");

    await categoryModel.insertMany(defaultCategories.map(c => ({ ...c, isDefault: true })));

    console.log("🌱 Categories seeded successfully!");
  } catch (error) {
    console.error("Error seeding categories:", error);
  } finally {
    await mongoose.disconnect();
  }
};

seedCategories();



