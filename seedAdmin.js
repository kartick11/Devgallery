const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const Admin = require("./Models/Admin");

mongoose.connect(process.env.MONGO_URI);

const seedAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({
      officialEmail: "kartickmallav2004@gmail.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(
      "Admin@123",
      10
    );

    await Admin.create({
      "role": "admin",
      name: "Super Admin",
      officialEmail: "kartickmallav2004@gmail.com",
      pin:"1234",
      password: hashedPassword,
    });

    console.log("Admin created successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();