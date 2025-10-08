export const handleBuyNow = (
  index: number,
  cart: { name: string; quantity: number }[],
  products: { name: string; stock: number }[],
  setProducts: React.Dispatch<React.SetStateAction<any[]>>,
  setCart: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const selectedProduct = {
    name: cart[index].name,
    quantity: cart[index].quantity,
  };

  // Get current orders
  const orders: { name: string; quantity: number }[] = JSON.parse(
    localStorage.getItem("orders") || "[]"
  );

  // Find the product in products
  const product = products.find((p) => p.name === selectedProduct.name);

  if (!product) {
    alert("Product not found!");
    return;
  }

  // Check stock before subtracting
  if (selectedProduct.quantity > product.stock) {
    alert(`Not enough stock for ${selectedProduct.name}`);
    return;
  }

  // Update products with reduced stock
  const updatedProducts = products.map((p) =>
    p.name === selectedProduct.name
      ? { ...p, stock: p.stock - selectedProduct.quantity }
      : p
  );

  localStorage.setItem("products", JSON.stringify(updatedProducts));
  setProducts(updatedProducts);

  // Add to orders
  orders.push(selectedProduct);
  localStorage.setItem("orders", JSON.stringify(orders));

  // Remove from cart
  const updatedCart = cart.filter((_, i) => i !== index);
  localStorage.setItem("cart", JSON.stringify(updatedCart));
  setCart(updatedCart);

  alert(`Ordered ${selectedProduct.quantity} ${selectedProduct.name}(s)`);
};

export const handleBuySelected = (
  selectedItems: string[],
  products: { name: string; stock: number }[],
  cart: { name: string; quantity: number }[],
  setProducts: React.Dispatch<React.SetStateAction<any[]>>,
  setCart: React.Dispatch<React.SetStateAction<any[]>>,
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>
) => {
  if (selectedItems.length === 0) {
    alert("No items selected.");
    return;
  }

  // Get current orders
  const orders: { name: string; quantity: number }[] = JSON.parse(
    localStorage.getItem("orders") || "[]"
  );

  let updatedProducts = [...products];
  let updatedCart = [...cart];

  selectedItems.forEach((name) => {
    const item = updatedCart.find((c) => c.name === name);
    if (!item) return;

    // Reduce stock
    updatedProducts = updatedProducts.map((p) =>
      p.name === name ? { ...p, stock: p.stock - item.quantity } : p
    );

    // Add to orders
    orders.push({ name, quantity: item.quantity });

    // Remove from cart
    updatedCart = updatedCart.filter((c) => c.name !== name);
  });

  // Save updates
  localStorage.setItem("products", JSON.stringify(updatedProducts));
  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.setItem("cart", JSON.stringify(updatedCart));

  setProducts(updatedProducts);
  setCart(updatedCart);
  setSelectedItems([]);

  alert(`Ordered: ${selectedItems.join(", ")}`);
};

export const handleQuantity = (
  index: number,
  type: "add" | "minus",
  cart: { name: string; quantity: number }[],
  setCart: React.Dispatch<
    React.SetStateAction<{ name: string; quantity: number }[]>
  >,
  products: { name: string; stock: number }[]
) => {
  setCart((prevCart) => {
    const newCart = [...prevCart];
    const product = products.find((p) => p.name === newCart[index].name);
    if (!product) return newCart;

    if (type === "add") {
      if (newCart[index].quantity < product.stock) {
        newCart[index] = {
          ...newCart[index],
          quantity: newCart[index].quantity + 1,
        };
      }
    } else if (type === "minus") {
      if (newCart[index].quantity > 1) {
        newCart[index] = {
          ...newCart[index],
          quantity: newCart[index].quantity - 1,
        };
      } else {
        newCart.splice(index, 1);
      }
    }

    localStorage.setItem("cart", JSON.stringify(newCart));
    return newCart;
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
