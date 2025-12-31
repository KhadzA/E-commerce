import fs from "fs";
import path from "path";

const filePath = path.resolve("ordersTemp.txt");

// Read orders from file
const readOrdersFromFile = () => {
  if (!fs.existsSync(filePath)) return [];

  const data = fs.readFileSync(filePath, "utf8");

  return data
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const orderIdMatch = line.match(/orderId:(\d+)/);
      const userIdMatch = line.match(/userId:(\S+)/);
      const itemsMatch = line.match(/totalItems:(\d+)/);
      const quantityMatch = line.match(/totalQuantity:(\d+)/);
      const statusMatch = line.match(/status:(\S+)/);

      return {
        orderId: orderIdMatch ? parseInt(orderIdMatch[1]) : 0,
        userId: userIdMatch ? userIdMatch[1] : "",
        totalItems: itemsMatch ? parseInt(itemsMatch[1]) : 0,
        totalQuantity: quantityMatch ? parseInt(quantityMatch[1]) : 0,
        status: statusMatch ? statusMatch[1] : "UNKNOWN",
      };
    });
};

// Get all orders (ordered list)
export const getOrders = (req, res) => {
  const orders = readOrdersFromFile();

  // Optional: sort by orderId (ascending)
  orders.sort((a, b) => a.orderId - b.orderId);

  res.json({
    count: orders.length,
    orders,
  });
};
