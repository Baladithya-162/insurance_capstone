import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const register1 = async ({ userData }) => {
  const { name, email, password } = userData; // ✅ ignore role input

  // check duplicate
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role: "customer" // ✅ enforce default role
  });

  await newUser.save();

  return {
    message: "User registered successfully",
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  };
};

export const login1 = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Email not found");
  }

  // compare hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid password");
  }

  // create token
  const token = jwt.sign(
    { _id: user._id.toString(), role: user.role }, // ✅ use _id consistently
    process.env.JWT_SECRET, // ✅ keep consistent with controller
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};
