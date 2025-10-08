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

export const handleQuickAddToCart = (
  index: number,
  recommended: any[],
  quantities: number[],
  setQuantities: React.Dispatch<React.SetStateAction<number[]>>
) => {
  handleAddCart(index, recommended, quantities);

  // reset quantity for that product back to 1
  setQuantities((prev) => {
    const next = [...prev];
    next[index] = 1;
    return next;
  });
};

export const handleQuickBuy = (
  index: number,
  recommended: any[],
  quantities: number[],
  setRecommended: React.Dispatch<React.SetStateAction<any[]>>,
  setQuantities: React.Dispatch<React.SetStateAction<number[]>>
) => {
  // setProducts is not needed for home quick buy, so pass a dummy setter
  handleBuyNow(index, recommended, quantities, (() => {}) as any);

  // Refresh recommended after buying (e.g. stock might have changed)
  const updatedProducts = JSON.parse(localStorage.getItem("products") || "[]");

  if (Array.isArray(updatedProducts) && updatedProducts.length > 0) {
    const shuffled = [...updatedProducts].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    setRecommended(selected);
    setQuantities(selected.map(() => 1));
  } else {
    setRecommended([]);
    setQuantities([]);
  }
};
