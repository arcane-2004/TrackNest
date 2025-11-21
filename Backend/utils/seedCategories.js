const categoryModel = require("../models/category.model");
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

const defaultCategories = [
	{ name: "Food", icon: "Hamburger", type: "expense", color: "#fef08a" },
	{ name: "Transport", icon: "Bus", type: "expense", color: "#f9a8d4" },
	{ name: "Shopping", icon: "ShoppingCart", type: "expense", color: "#818cf8" },
	{ name: "Bills", icon: "Receipt", type: "expense", color: "#fdba74" },
	{ name: "Salary", icon: "Wallet", type: "income", color: "#bef264" },
	{ name: "Refund", icon: "PiggyBank", type: "income", color: "#a5f3fc" },
	{ name: "Interest", icon: "CreditCard", type: "income", color: "#d4d4d8" },
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    // console.log("Connected to MongoDB");

    await categoryModel.insertMany(defaultCategories.map(c => ({ ...c, isDefault: true })));

    console.log("Categories seeded successfully!");
  } catch (error) {
    console.error("Error seeding categories:", error);
  } finally {
    await mongoose.disconnect();
  }
};

seedCategories();



