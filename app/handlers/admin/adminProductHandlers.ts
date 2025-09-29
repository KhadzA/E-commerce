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

  alert(`Added ${selectedProduct.quantity} ${selectedProduct.name}(s) to cart`);
};
