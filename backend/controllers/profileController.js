import fs from "fs";
import path from "path";

const filePath = path.resolve("profileTemp.txt");

// Read profiles
const readProfilesFromFile = () => {
  if (!fs.existsSync(filePath)) return [];

  const data = fs.readFileSync(filePath, "utf8");

  return data
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const userIdMatch = line.match(/userId:(\S+)/);
      const emailMatch = line.match(/email:(\S+)/);
      const nameMatch = line.match(/name:(\S+)/);
      const phoneMatch = line.match(/phone:(\S+)/);
      const addressMatch = line.match(/address:(\S+)/);
      const roleMatch = line.match(/role:(\S+)/);

      return {
        userId: userIdMatch ? userIdMatch[1] : "",
        email: emailMatch ? emailMatch[1] : "",
        name: nameMatch ? nameMatch[1] : "",
        phone: phoneMatch ? phoneMatch[1] : "",
        address: addressMatch ? addressMatch[1] : "",
        role: roleMatch ? roleMatch[1] : "customer",
      };
    });
};

// Write profiles
const writeProfilesToFile = (profiles) => {
  const data = profiles
    .map(
      (p) =>
        `userId:${p.userId} email:${p.email} name:${p.name || ""} phone:${p.phone || ""} address:${p.address || ""} role:${p.role || "customer"}`,
    )
    .join("\n");

  fs.writeFileSync(filePath, data + "\n", "utf8");
};

// GET user profile
export const getProfile = (req, res) => {
  const { userId } = req.params;
  const profiles = readProfilesFromFile();
  const profile = profiles.find((p) => p.userId === userId);
  if (!profile) return res.status(404).json({ message: "Profile not found." });
  res.json(profile);
};

// CREATE profile
export const createProfile = (req, res) => {
  const { userId, email, name, phone, address, role } = req.body;

  if (!userId || !email)
    return res.status(400).json({ message: "userId and email are required." });

  const profiles = readProfilesFromFile();
  const exists = profiles.find((p) => p.userId === userId);
  if (exists)
    return res.status(400).json({ message: "Profile already exists." });

  const newProfile = {
    userId,
    email,
    name: name || "",
    phone: phone || "",
    address: address || "",
    role: role || "customer",
  };
  profiles.push(newProfile);
  writeProfilesToFile(profiles);

  res.status(201).json({ message: "Profile created.", profile: newProfile });
};

// UPDATE profile
export const updateProfile = (req, res) => {
  const { userId } = req.params;
  const { name, phone, address } = req.body;

  const profiles = readProfilesFromFile();
  const index = profiles.findIndex((p) => p.userId === userId);

  if (index === -1)
    return res.status(404).json({ message: "Profile not found." });

  if (name !== undefined) profiles[index].name = name;
  if (phone !== undefined) profiles[index].phone = phone;
  if (address !== undefined) profiles[index].address = address;
  // role is intentionally NOT updatable by the user — admin only via backend

  writeProfilesToFile(profiles);
  res.json({ message: "Profile updated.", profile: profiles[index] });
};
