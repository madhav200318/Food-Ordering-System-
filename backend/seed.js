require("dotenv").config();
const mongoose = require("mongoose");
const Food = require("./models/Food");

const foods = [
  { name: "Margherita Pizza", category: "Pizza", price: 249, description: "Classic tomato, mozzarella, basil" },
  { name: "Farmhouse Pizza", category: "Pizza", price: 329, description: "Capsicum, onion, mushroom, corn" },
  { name: "Veg Burger", category: "Burgers", price: 129, description: "Crispy patty with fresh veggies" },
  { name: "Chicken Burger", category: "Burgers", price: 169, description: "Grilled chicken, lettuce, mayo" },
  { name: "Paneer Butter Masala", category: "Main Course", price: 279, description: "Creamy tomato gravy with paneer" },
  { name: "Chicken Biryani", category: "Main Course", price: 299, description: "Hyderabadi dum biryani" },
  { name: "Masala Dosa", category: "South Indian", price: 99, description: "Crisp dosa with potato masala" },
  { name: "Idli Sambar", category: "South Indian", price: 69, description: "Steamed idlis with sambar and chutney" },
  { name: "French Fries", category: "Sides", price: 89, description: "Salted crispy fries" },
  { name: "Gulab Jamun", category: "Desserts", price: 79, description: "Two pieces, warm" },
  { name: "Cold Coffee", category: "Beverages", price: 99, description: "Chilled and creamy" },
  { name: "Fresh Lime Soda", category: "Beverages", price: 59, description: "Sweet or salted" },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/food_ordering");
  await Food.deleteMany({});
  await Food.insertMany(foods);
  console.log(`Seeded ${foods.length} food items`);
  await mongoose.disconnect();
})();
