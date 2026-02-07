import fs from "fs";
import path from "path";

const filePath = path.resolve("usersTemp.txt");
const profileFilePath = path.resolve("profileTemp.txt");
let loggedInUser = null;

// Helper: read all users from file
const readUsersFromFile = () => {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, "utf8");
  return data
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const idMatch = line.match(/userId:(\d+)/);
      const emailMatch = line.match(/userEmail:(\S+)/);
      const passMatch = line.match(/userPassword:(\S+)/);

      return {
        id: idMatch ? parseInt(idMatch[1]) : 0,
        email: emailMatch ? emailMatch[1] : "",
        password: passMatch ? passMatch[1] : "",
      };
    });
};

// Helper: append a new user to file
const addUserToFile = (id, email, password) => {
  const line = `userId:${id} userEmail:${email} userPassword:${password}\n`;
  fs.appendFileSync(filePath, line);
};

// Helper: add profile to file
const addProfileToFile = (userId, email) => {
  const line = `userId:${userId} email:${email} name: phone: address:\n`;
  fs.appendFileSync(profileFilePath, line);
};

// Register user
export const userRegister = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required." });

  const users = readUsersFromFile();
  const existingUser = users.find((u) => u.email === email);

  if (existingUser)
    return res.status(400).json({ message: "User already exists." });

  // Generate new userId
  const newUserId = users.length > 0 ? users[users.length - 1].id + 1 : 1;

  // Save user
  addUserToFile(newUserId, email, password);

  // Auto-create profile
  addProfileToFile(newUserId, email);

  res.status(201).json({
    message: "User registered successfully.",
    userId: newUserId,
  });
};

// Login user
export const userLogin = (req, res) => {
  const { email, password } = req.body;
  const users = readUsersFromFile();

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials." });

  loggedInUser = user;
  res.json({ message: `Welcome, ${user.email}!`, user });
};

// Logout user
export const userLogout = (req, res) => {
  if (!loggedInUser)
    return res.status(400).json({ message: "No user is currently logged in." });

  const userEmail = loggedInUser.email;
  loggedInUser = null;
  res.json({ message: `${userEmail} has been logged out.` });
};
