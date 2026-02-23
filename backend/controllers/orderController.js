import fs from "fs";
import path from "path";

const filePath = path.resolve("ordersTemp.txt");
const productsFilePath = path.resolve("productsTemp.txt");

// ─── Helpers ────────────────────────────────────────────────────────────────

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

const readProductsFromFile = () => {
  if (!fs.existsSync(productsFilePath)) return [];
  const data = fs.readFileSync(productsFilePath, "utf8");

  return data
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const idMatch = line.match(/productId:(\S+)/);
      const nameMatch = line.match(/productName:(\S+)/);
      const priceMatch = line.match(/productPrice:(\S+)/);
      const stockMatch = line.match(/productStock:(\S+)/);
      const categoryMatch = line.match(/productCategory:(\S+)/);

      return {
        id: parseInt(idMatch ? idMatch[1] : 0),
        name: nameMatch ? nameMatch[1] : "",
        price: parseFloat(priceMatch ? priceMatch[1] : 0),
        stock: parseInt(stockMatch ? stockMatch[1] : 0),
        category: categoryMatch ? categoryMatch[1] : "",
      };
    });
};

const writeProductsToFile = (products) => {
  const data = products
    .map(
      (p) =>
        `productId:${p.id} productName:${p.name} productPrice:${p.price} productStock:${p.stock} productCategory:${p.category ?? ""}`,
    )
    .join("\n");

  fs.writeFileSync(productsFilePath, data + "\n", "utf8");
};

// ─── Controllers ────────────────────────────────────────────────────────────

// POST /orders — Create new order and deduct stock
export const createOrder = (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || !quantity) {
    return res
      .status(400)
      .json({ message: "userId, productId, and quantity are required." });
  }

  // Find product and validate stock
  const products = readProductsFromFile();
  const productIndex = products.findIndex((p) => p.id === parseInt(productId));

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found." });
  }

  const product = products[productIndex];

  if (product.stock < parseInt(quantity)) {
    return res
      .status(400)
      .json({ message: `Not enough stock for ${product.name}.` });
  }

  // Deduct stock
  products[productIndex].stock -= parseInt(quantity);
  writeProductsToFile(products);

  // Write order
  const orders = readOrdersFromFile();
  const nextOrderId =
    orders.length > 0 ? orders[orders.length - 1].orderId + 1 : 1;

  const newOrder = {
    orderId: nextOrderId,
    userId,
    totalItems: 1,
    totalQuantity: parseInt(quantity),
    status: "PLACED",
  };

  const line = `orderId:${newOrder.orderId} userId:${newOrder.userId} totalItems:${newOrder.totalItems} totalQuantity:${newOrder.totalQuantity} status:${newOrder.status}\n`;
  fs.appendFileSync(filePath, line, "utf8");

  res.status(201).json({
    message: `Order placed for ${quantity}x ${product.name}.`,
    order: newOrder,
    updatedProduct: products[productIndex],
  });
};

// GET /orders/ordersList — Get all orders
export const getOrders = (req, res) => {
  const orders = readOrdersFromFile();
  orders.sort((a, b) => a.orderId - b.orderId);

  res.json({
    count: orders.length,
    orders,
  });
};
