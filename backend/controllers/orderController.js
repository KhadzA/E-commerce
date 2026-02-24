import fs from "fs";
import path from "path";

const filePath = path.resolve("ordersTemp.txt");
const productsFilePath = path.resolve("productsTemp.txt");

const readOrdersFromFile = () => {
  if (!fs.existsSync(filePath)) return [];

  const data = fs.readFileSync(filePath, "utf8");

  return data
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const orderIdMatch = line.match(/orderId:(\d+)/);
      const userIdMatch = line.match(/userId:(\S+)/);
      const productIdMatch = line.match(/productId:(\d+)/);
      const productNameMatch = line.match(/productName:(\S+)/);
      const productPriceMatch = line.match(/productPrice:(\S+)/);
      const itemsMatch = line.match(/totalItems:(\d+)/);
      const quantityMatch = line.match(/totalQuantity:(\d+)/);
      const totalPriceMatch = line.match(/totalPrice:(\S+)/);
      const statusMatch = line.match(/status:(\S+)/);
      const dateMatch = line.match(/date:(\S+)/);
      const categoryMatch = line.match(/category:(\S+)/);

      return {
        orderId: orderIdMatch ? parseInt(orderIdMatch[1]) : 0,
        userId: userIdMatch ? userIdMatch[1] : "",
        productId: productIdMatch ? parseInt(productIdMatch[1]) : 0,
        productName: productNameMatch ? productNameMatch[1] : "",
        productPrice: productPriceMatch ? parseFloat(productPriceMatch[1]) : 0,
        totalItems: itemsMatch ? parseInt(itemsMatch[1]) : 0,
        totalQuantity: quantityMatch ? parseInt(quantityMatch[1]) : 0,
        totalPrice: totalPriceMatch ? parseFloat(totalPriceMatch[1]) : 0,
        status: statusMatch ? statusMatch[1] : "UNKNOWN",
        date: dateMatch ? dateMatch[1] : "",
        category: categoryMatch ? categoryMatch[1] : "",
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

// POST /orders — Create order, deduct stock, persist price snapshot
export const createOrder = (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || !quantity) {
    return res
      .status(400)
      .json({ message: "userId, productId, and quantity are required." });
  }

  const products = readProductsFromFile();
  const productIndex = products.findIndex((p) => p.id === parseInt(productId));

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found." });
  }

  const product = products[productIndex];
  const qty = parseInt(quantity);

  if (product.stock < qty) {
    return res
      .status(400)
      .json({ message: `Not enough stock for ${product.name}.` });
  }

  // Deduct stock
  products[productIndex].stock -= qty;
  writeProductsToFile(products);

  // Build order with price snapshot at time of purchase
  const orders = readOrdersFromFile();
  const nextOrderId =
    orders.length > 0 ? orders[orders.length - 1].orderId + 1 : 1;

  const totalPrice = parseFloat((product.price * qty).toFixed(2));

  const newOrder = {
    orderId: nextOrderId,
    userId,
    productId: product.id,
    productName: product.name,
    productPrice: product.price,
    totalItems: 1,
    totalQuantity: qty,
    totalPrice,
    date: new Date().toISOString(),
    category: product.category ?? "",
    status: "PLACED",
  };

  const line =
    `orderId:${newOrder.orderId} ` +
    `userId:${newOrder.userId} ` +
    `productId:${newOrder.productId} ` +
    `productName:${newOrder.productName} ` +
    `productPrice:${newOrder.productPrice} ` +
    `totalItems:${newOrder.totalItems} ` +
    `totalQuantity:${newOrder.totalQuantity} ` +
    `totalPrice:${newOrder.totalPrice} ` +
    `date:${newOrder.date} ` +
    `category:${newOrder.category} ` +
    `status:${newOrder.status}\n`;

  fs.appendFileSync(filePath, line, "utf8");

  res.status(201).json({
    message: `Order placed for ${qty}x ${product.name}.`,
    order: newOrder,
    updatedProduct: products[productIndex],
  });
};

// GET /orders/ordersList — Get all orders sorted by orderId
export const getOrders = (req, res) => {
  const orders = readOrdersFromFile();
  orders.sort((a, b) => a.orderId - b.orderId);

  res.json({
    count: orders.length,
    orders,
  });
};

// GET /orders/user/:userId — Get orders for a specific user
export const getOrdersByUser = (req, res) => {
  const { userId } = req.params;
  const orders = readOrdersFromFile();

  const userOrders = orders
    .filter((o) => String(o.userId) === String(userId))
    .sort((a, b) => a.orderId - b.orderId);

  res.json({
    count: userOrders.length,
    orders: userOrders,
  });
};
