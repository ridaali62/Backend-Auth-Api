const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();
const bcrypt = require("bcrypt");
const auth = require("./middlewares/auth");
const admin = require("./middlewares/admin");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Backend Running",
  });
});
app.get("/admin/users",auth, admin, async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      name: true,
      email: true,
      role: true
    },
  });
  res.json(users);
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    res.json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const token = jwt.sign(
      {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
      },
      process.env.JWT_SECRET_CODE,
    );
    res.json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});
app.get("/profile", auth, (req, res) => {
  res.json({
    success: true,
    message: `welcome to your profile ${req.user.name}`,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    },
  });
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  if (isNaN(parseInt(id))) {
    return res.status(400).json({
      success: false,
      message: "Invalid user id",
    });
  }
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

app.post("/logout", auth, (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});
app.listen(process.env.PORT, () => {
  console.log("Server Running");
});
