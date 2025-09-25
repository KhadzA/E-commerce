import { useEffect, useState } from "react";

function Cart() {
  const [cart, setCart] = useState<{ name: string; quantity: number }[]>([]);
  const [products, setProducts] = useState<{ name: string; stock: number }[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]); // track selected product names

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    setProducts(storedProducts);
    setCart(storedCart);
  }, []);

  const handleQuantity = (index: number, type: "add" | "minus") => {
    setCart((prevCart) => {
      const newCart = [...prevCart];

      // find the matching product by name
      const product = products.find((p) => p.name === newCart[index].name);

      if (!product) return newCart;

      if (type === "add") {
        //prevent going over stock
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
          // remove item if quantity reaches 0
          newCart.splice(index, 1);
        }
      }

      //update localStorage only once per state update
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  // toggle checkbox selection
  const toggleSelection = (name: string) => {
    setSelectedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name) // remove if already selected
        : [...prev, name] // add if not selected
    );
  };

  // buy selected items
  const handleBuySelected = () => {
    if (selectedItems.length === 0) {
      alert("No items selected.");
      return;
    }

    // Get current orders
    const orders: { name: string; quantity: number }[] =
      JSON.parse(localStorage.getItem("orders") || "[]");

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


  const handleBuyNow = (index: number) => {
    const selectedProduct = {
      name: cart[index].name,
      quantity: cart[index].quantity,
    };

    // Get current orders
    const orders: { name: string; quantity: number }[] =
      JSON.parse(localStorage.getItem("orders") || "[]");

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




  return (
    <div>
      <div className="cartList">
        {cart.map((item, index) => {
          const product = products.find((p) => p.name === item.name);
          return (
            <div key={index}>
              <input
                type="checkbox"
                checked={selectedItems.includes(item.name)}
                onChange={() => toggleSelection(item.name)}
              />
              <span className="product-images">img</span>
              <br />
              {item.name}
              <br />
              <small>Stock: {product ? product.stock : "?"}</small>
              <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                <button onClick={() => handleQuantity(index, "minus")}>-</button>
                <span className="quantity">{item.quantity}</span>
                <button onClick={() => handleQuantity(index, "add")}>+</button>
              </div>
              <button onClick={() => handleBuyNow(index)}>Buy now</button>
            </div>
          );
        })}
      </div>
      
      <br />

      <button onClick={handleBuySelected} disabled={selectedItems.length === 0}>
        Buy Selected
      </button>
    </div>
  );
}

export default Cart;
