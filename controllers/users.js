const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sendMail = require("../utils/mail");

const prisma = new PrismaClient();

const signUp = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        isVerified: false,
      },
    });

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    sendMail(
      email,
      "Thank you for registering",
      `<p>Hi ${name},</p><p>Thank you for registering on our platform. We're glad to have you on board!</p>`
    );

    sendMail(
      email,
      "Verify your email",
      `<p>Hi ${name},</p><p>Please click the link below to verify your email:</p><p><a href="https://localhost:5000/verify?token=${token}">Verify Email</a></p>`
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" || false,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: "User created", result: newUser });
  } catch (err) {
    res.status(500).json({ message: "Error creating user", err });
    console.log(err);
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "Email or password is incorrect" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Email or password is incorrect" });
    }

    const authToken = jwt.sign(
      { id: existingUser.id, role: existingUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Logged in", result: existingUser });
  } catch (err) {
    res.status(500).json({ message: "Error logging user", err });
    console.log(err);
  }
};

const verifyMail = async (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.status(400).json({ message: "Verification token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const updateUser = await prisma.user.update({
      where: { id: decoded.id },
      data: { isVerified: true },
    });

    const authToken = jwt.sign(
      { id: updateUser.id, role: updateUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" || false,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Email Verified", result: updateUser });
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Verification token has expired" });
    } else if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Verification token is invalid" });
    } else {
      res.status(500).json({ message: "Error verifying email", err });
      console.log(err);
    }
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");

  res.status(200).json({ message: "Logged out" });
};

module.exports = { signUp, signIn, verifyMail, logout };
