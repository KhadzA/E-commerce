import fs from "fs";
import path from "path";

const filePath = path.resolve("cartTemp.txt");

// Read carts from file
const readCartsFromFile = () => {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, "utf8");

  return data
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const userMatch = line.match(/userId:(\S+)/);
      const productMatch = line.match(/productId:(\S+)/);
      const quantityMatch = line.match(/quantity:(\S+)/);

      return {
        userId: userMatch ? userMatch[1] : "",
        productId: productMatch ? parseInt(productMatch[1]) : 0,
        quantity: quantityMatch ? parseInt(quantityMatch[1]) : 0,
      };
    });
};

//  Write carts to file
const writeCartsToFile = (carts) => {
  const data = carts
    .map(
      (c) =>
        `userId:${c.userId} productId:${c.productId} quantity:${c.quantity}`
    )
    .join("\n");

  fs.writeFileSync(filePath, data + "\n", "utf8");
};

//  Get cart for user
export const getCart = (req, res) => {
  const { userId } = req.params;
  const carts = readCartsFromFile();

  const userCart = carts.filter((c) => c.userId === userId);
  res.json(userCart);
};

//  Add a product to cartss
export const addToCart = (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;

  if (!productId || !quantity)
    return res
      .status(400)
      .json({ message: "Product ID and quantity required." });

  const carts = readCartsFromFile();
  const existing = carts.find(
    (c) => c.userId === userId && c.productId === parseInt(productId)
  );

  if (existing) {
    existing.quantity += parseInt(quantity);
  } else {
    carts.push({
      userId,
      productId: parseInt(productId),
      quantity: parseInt(quantity),
    });
  }

  writeCartsToFile(carts);
  res.status(201).json({ message: "Item added to cart.", carts });
};

//  Update quantity of a product
export const updateCartItem = (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  const carts = readCartsFromFile();
  const item = carts.find(
    (c) => c.userId === userId && c.productId === parseInt(productId)
  );

  if (!item)
    return res.status(404).json({ message: "Item not found in cart." });

  item.quantity = parseInt(quantity);
  writeCartsToFile(carts);
  res.json({ message: "Cart item updated.", item });
};

// Remove a single product
export const removeFromCart = (req, res) => {
  const { userId, productId } = req.params;

  let carts = readCartsFromFile();
  const index = carts.findIndex(
    (c) => c.userId === userId && c.productId === parseInt(productId)
  );

  if (index === -1)
    return res.status(404).json({ message: "Item not found in cart." });

  const removed = carts.splice(index, 1);
  writeCartsToFile(carts);

  res.json({ message: "Item removed from cart.", removed });
};

// Clear the entire cart
export const clearCart = (req, res) => {
  const { userId } = req.params;
  let carts = readCartsFromFile();

  carts = carts.filter((c) => c.userId !== userId);
  writeCartsToFile(carts);

  res.json({ message: "Cart cleared for user.", userId });
};
