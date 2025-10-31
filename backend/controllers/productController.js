import fs from "fs";
import path from "path";

const filePath = path.resolve("productsTemp.txt");

//  read all products from file
const readProductsFromFile = () => {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, "utf8");

  return data
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const idMatch = line.match(/productId:(\S+)/);
      const nameMatch = line.match(/productName:(\S+)/);
      const priceMatch = line.match(/productPrice:(\S+)/);
      const stockMatch = line.match(/productStock:(\S+)/);

      return {
        id: parseInt(idMatch ? idMatch[1] : 0),
        name: nameMatch ? nameMatch[1] : "",
        price: parseFloat(priceMatch ? priceMatch[1] : 0),
        stock: parseInt(stockMatch ? stockMatch[1] : 0),
      };
    });
};

// write all products to file (overwrite)
const writeProductsToFile = (products) => {
  const data = products
    .map(
      (p) =>
        `productId:${p.id} productName:${p.name} productPrice:${p.price} productStock:${p.stock}`
    )
    .join("\n");

  fs.writeFileSync(filePath, data + "\n", "utf8");
};

//GET all products
export const getProducts = (req, res) => {
  const products = readProductsFromFile();
  res.json(products);
};

//GET product by ID
export const getProductById = (req, res) => {
  const { id } = req.params;
  const products = readProductsFromFile();
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) return res.status(404).json({ message: "Product not found." });
  res.json(product);
};

//ADD new product
export const addProduct = (req, res) => {
  const { name, price, stock } = req.body;

  if (!name || !price || !stock)
    return res
      .status(400)
      .json({ message: "Name, price, and stock are required." });

  const products = readProductsFromFile();
  const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;

  const newProduct = { id: newId, name, price, stock };
  products.push(newProduct);

  writeProductsToFile(products);
  res.status(201).json({ message: "Product added.", product: newProduct });
};

//PDATE product
export const updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, price, stock } = req.body;

  const products = readProductsFromFile();
  const index = products.findIndex((p) => p.id === parseInt(id));

  if (index === -1)
    return res.status(404).json({ message: "Product not found." });

  if (name) products[index].name = name;
  if (price) products[index].price = price;
  if (stock) products[index].stock = stock;

  writeProductsToFile(products);
  res.json({ message: "Product updated.", product: products[index] });
};

//DELETE product
export const deleteProduct = (req, res) => {
  const { id } = req.params;

  let products = readProductsFromFile();
  const index = products.findIndex((p) => p.id === parseInt(id));

  if (index === -1)
    return res.status(404).json({ message: "Product not found." });

  const deleted = products.splice(index, 1);
  writeProductsToFile(products);

  res.json({ message: "Product deleted.", deleted });
};
