const API_BASE = "http://localhost:5000";

const getUserId = () => {
  const userId = localStorage.getItem("userId");
  if (!userId) throw new Error("User not logged in");
  return userId;
};

export const handleBuyNow = async (
  productId: number,
  quantity: number,
  setCart: React.Dispatch<React.SetStateAction<any[]>>,
  setProducts: React.Dispatch<React.SetStateAction<any[]>>,
) => {
  try {
    const userId = getUserId();

    // Place order — backend deducts stock atomically
    const orderRes = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId, quantity }),
    });

    if (!orderRes.ok) {
      const err = await orderRes.json();
      alert(err.message || "Failed to place order.");
      return;
    }

    const orderData = await orderRes.json();

    // Sync updated stock into products state
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? orderData.updatedProduct : p)),
    );

    // Remove item from cart
    await fetch(`${API_BASE}/cart/${userId}/remove/${productId}`, {
      method: "DELETE",
    });

    // Refresh cart
    const cartRes = await fetch(`${API_BASE}/cart/${userId}`);
    const updatedCart = await cartRes.json();
    setCart(updatedCart);

    alert(`Order placed for ${quantity}x item!`);
  } catch (err) {
    console.error(err);
    alert("Failed to process order");
  }
};

export const handleBuySelected = async (
  selectedProductIds: number[],
  cart: { productId: number; quantity: number }[],
  setCart: React.Dispatch<React.SetStateAction<any[]>>,
  setSelectedItems: React.Dispatch<React.SetStateAction<number[]>>,
  setProducts: React.Dispatch<React.SetStateAction<any[]>>,
) => {
  if (selectedProductIds.length === 0) {
    alert("No items selected.");
    return;
  }

  try {
    const userId = getUserId();

    for (const productId of selectedProductIds) {
      const cartItem = cart.find((c) => c.productId === productId);
      if (!cartItem) continue;

      const orderRes = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId,
          quantity: cartItem.quantity,
        }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        alert(`Failed for product #${productId}: ${err.message}`);
        continue;
      }

      const orderData = await orderRes.json();

      // Sync updated stock per item
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? orderData.updatedProduct : p)),
      );

      // Remove from cart
      await fetch(`${API_BASE}/cart/${userId}/remove/${productId}`, {
        method: "DELETE",
      });
    }

    // Refresh cart once after all orders
    const cartRes = await fetch(`${API_BASE}/cart/${userId}`);
    const updatedCart = await cartRes.json();
    setCart(updatedCart);
    setSelectedItems([]);

    alert("All selected orders placed!");
  } catch (err) {
    console.error(err);
    alert("Failed to process selected items");
  }
};

export const handleQuantity = async (
  productId: number,
  type: "add" | "minus",
  currentQuantity: number,
  stock: number,
  setCart: React.Dispatch<React.SetStateAction<any[]>>,
) => {
  try {
    const userId = getUserId();
    const newQuantity =
      type === "add" ? currentQuantity + 1 : currentQuantity - 1;

    if (type === "add" && newQuantity > stock) {
      alert("Cannot exceed available stock.");
      return;
    }

    if (newQuantity <= 0) {
      await fetch(`${API_BASE}/cart/${userId}/remove/${productId}`, {
        method: "DELETE",
      });
    } else {
      await fetch(`${API_BASE}/cart/${userId}/update/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });
    }

    const res = await fetch(`${API_BASE}/cart/${userId}`);
    const updatedCart = await res.json();
    setCart(updatedCart);
  } catch (err) {
    console.error(err);
    alert("Failed to update quantity");
  }
};

export const toggleSelection = (
  productId: number,
  setSelectedItems: React.Dispatch<React.SetStateAction<number[]>>,
) => {
  setSelectedItems((prev) =>
    prev.includes(productId)
      ? prev.filter((id) => id !== productId)
      : [...prev, productId],
  );
};
