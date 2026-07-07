import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import AdminUser from "../src/models/adminUser.js"; // NOTE .js extension

async function main() {
  const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!MONGODB_URI) throw new Error("Missing MONGODB_URI / MONGO_URI");

  const email = (process.env.SUPER_ADMIN_EMAIL || "sakthe.ipoglabs@gmail.com").toLowerCase();
  const password = process.env.SUPER_ADMIN_PASSWORD || "SuperAdmin@123";
  const employeeId = process.env.SUPER_ADMIN_EMPLOYEE_ID || "EMP-SUPER-001";

  await mongoose.connect(MONGODB_URI);
  console.log("✅ MongoDB connected");

  const exists = await AdminUser.findOne({ email }).lean();
  if (exists) {
    console.log("✅ Super admin already exists:", exists.email);
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await AdminUser.create({
    firstName: "Super",
    lastName: "Admin",
    designation: "Super Admin",
    age: 30,
    gender: "male",
    country: "IN",
    location: "HQ",
    role: "super_admin",
    employeeId,
    email,
    password: passwordHash,
    isActive: true,
    createdBy: null,
  });

  console.log("✅ Super admin created:", email);
  console.log("🔐 Password:", password);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
