// Temporary in-memory "database"
let products = [
  { id: 1, name: "Laptop", price: 999, stock: 5 },
  { id: 2, name: "Phone", price: 499, stock: 10 },
  { id: 3, name: "Headphones", price: 199, stock: 15 },
]; // might be replaced with file-based or real database storage later

// Get all products
export const getProducts = (req, res) => {
  res.json(products);
};

// Get a product by ID
export const getProductById = (req, res) => {
  const { id } = req.params;
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return res.status(404).json({ message: "Product not found." });
  }

  res.json(product);
};

// Add a new product
export const addProduct = (req, res) => {
  const { name, price, stock } = req.body;

  if (!name || !price || !stock) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const newProduct = {
    id: products.length + 1,
    name,
    price,
    stock,
  };

  products.push(newProduct);
  res.status(201).json({ message: "Product added.", product: newProduct });
};

// Update a product
export const updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, price, stock } = req.body;

  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return res.status(404).json({ message: "Product not found." });
  }

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;

  res.json({ message: "Product updated.", product });
};

// Delete a product
export const deleteProduct = (req, res) => {
  const { id } = req.params;
  const index = products.findIndex((p) => p.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ message: "Product not found." });
  }

  const deletedProduct = products.splice(index, 1);
  res.json({ message: "Product deleted.", deletedProduct });
};
