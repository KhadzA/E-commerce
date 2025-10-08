export const handleAddProduct = (
  name: string,
  stock: number,
  category: string,
  setProducts: React.Dispatch<React.SetStateAction<any[]>>,
  setQuantity: React.Dispatch<React.SetStateAction<number[]>>,
  setProductName: React.Dispatch<React.SetStateAction<string>>,
  setStock: React.Dispatch<React.SetStateAction<number | "">>,
  setProductCategory: React.Dispatch<React.SetStateAction<string>>
) => {
  if (!name.trim()) return;

  const selectedProduct = {
    name,
    stock: Number(stock),
    category,
  };

  const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");

  const exists = storedProducts.some(
    (p: any) => p.name === selectedProduct.name
  );

  if (!exists) {
    storedProducts.push(selectedProduct);
    localStorage.setItem("products", JSON.stringify(storedProducts));
    setProducts(storedProducts);
    setQuantity((prev) => [...prev, 1]);
  }

  setProductName("");
  setStock("");
  setProductCategory("");
};

export const handleAddCart = (
  index: number,
  products: { name: string; category: string }[],
  quantity: number[]
) => {
  const selectedProduct = {
    name: products[index].name,
    quantity: quantity[index],
    category: products[index].category,
  };

  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const existingProductIndex = cart.findIndex(
    (item: any) => item.name === selectedProduct.name
  );

  if (existingProductIndex !== -1) {
    cart[existingProductIndex].quantity += selectedProduct.quantity;
  } else {
    cart.push(selectedProduct);
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  alert(`Added ${selectedProduct.quantity} ${selectedProduct.name} to cart`);
};

export const handleBuyNow = (
  index: number,
  products: { name: string; category: string; stock: number }[],
  quantity: number[],
  setProducts: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const selectedProduct = {
    name: products[index].name,
    quantity: quantity[index],
    stock: products[index].stock,
  };

  // Get current orders
  const orders: { name: string; quantity: number; stock: number }[] =
    JSON.parse(localStorage.getItem("orders") || "[]");

  if (selectedProduct.quantity) {
    // Reduce stock
    const updatedProducts = [...products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      stock: updatedProducts[index].stock - selectedProduct.quantity,
    };

    if (updatedProducts[index].stock < 0) {
      alert(`Not enough stock for ${selectedProduct.name}`);
      return;
    }

    // Save updated products back
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    setProducts(updatedProducts);

    // Add to orders
    orders.push(selectedProduct);
    localStorage.setItem("orders", JSON.stringify(orders));

    alert(`Ordered ${selectedProduct.quantity} ${selectedProduct.name}(s)`);
  }
};

export const handleQuantity = (
  index: number,
  type: "add" | "minus",
  products: { name: string; stock: number; category: string }[],
  setQuantity: React.Dispatch<React.SetStateAction<number[]>>
) => {
  setQuantity((prev) => {
    const newQuantity = [...prev];
    if (type === "add") {
      newQuantity[index] += 1;
      if (newQuantity[index] > products[index].stock) {
        newQuantity[index] = products[index].stock;
      }
    } else if (type === "minus" && newQuantity[index] > 1) {
      newQuantity[index] -= 1;
    }
    return newQuantity;
  });
};

export const toggleSelection = (
  name: string,
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>
) => {
  setSelectedItems((prev) =>
    prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
  );
};

export const handleDeleteSelected = (
  selectedItems: string[],
  products: { name: string; stock: number; category: string }[],
  setProducts: React.Dispatch<React.SetStateAction<any[]>>,
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>
) => {
  if (selectedItems.length === 0) {
    alert("No products selected!");
    return;
  }

  const updatedProducts = products.filter(
    (prod) => !selectedItems.includes(prod.name)
  );

  setProducts(updatedProducts);
  localStorage.setItem("products", JSON.stringify(updatedProducts));
  setSelectedItems([]);
};

export const handleDeleteProduct = (
  name: string,
  products: { name: string; stock: number; category: string }[],
  setProducts: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const updatedProducts = products.filter((p) => p.name !== name);
  localStorage.setItem("products", JSON.stringify(updatedProducts));
  setProducts(updatedProducts);
};

export const handleEditProduct = (
  index: number,
  products: { name: string; stock: number; category: string }[],
  setEditIndex: React.Dispatch<React.SetStateAction<number | null>>,
  setEditForm: React.Dispatch<
    React.SetStateAction<{ name: string; stock: number; category: string }>
  >
) => {
  const product = products[index];
  setEditForm({
    name: product.name,
    stock: product.stock,
    category: product.category,
  });
  setEditIndex(index);
};

export const handleSaveEdit = (
  editIndex: number | null,
  editForm: { name: string; stock: number; category: string },
  products: { name: string; stock: number; category: string }[],
  setProducts: React.Dispatch<React.SetStateAction<any[]>>,
  setEditIndex: React.Dispatch<React.SetStateAction<number | null>>,
  setEditForm: React.Dispatch<
    React.SetStateAction<{ name: string; stock: number; category: string }>
  >
) => {
  if (editIndex === null) return;

  const updatedProducts = [...products];
  updatedProducts[editIndex] = { ...updatedProducts[editIndex], ...editForm };

  localStorage.setItem("products", JSON.stringify(updatedProducts));
  setProducts(updatedProducts);
  setEditIndex(null);
  setEditForm({ name: "", stock: 0, category: "" });
};

export const handleCancelEdit = (
  setEditIndex: React.Dispatch<React.SetStateAction<number | null>>,
  setEditForm: React.Dispatch<
    React.SetStateAction<{ name: string; stock: number; category: string }>
  >
) => {
  setEditIndex(null);
  setEditForm({ name: "", stock: 0, category: "" });
};

export const handleSearchProduct = (
  searchTerm: string,
  products: { name: string; stock: number; category: string }[],
  setFilteredProducts: React.Dispatch<
    React.SetStateAction<{ name: string; stock: number; category: string }[]>
  >
) => {
  const lower = searchTerm.toLowerCase().trim();

  if (lower === "") {
    // If empty, show all products
    setFilteredProducts(products);
  } else {
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.category.toLowerCase().includes(lower)
    );
    setFilteredProducts(filtered);
  }
};
