const API_BASE = "http://localhost:5000";

const getUserId = () => {
  const userId = localStorage.getItem("userId");
  if (!userId) throw new Error("User not logged in");
  return userId;
};

/**
 * BUY NOW
 * - Creates order
 * - Removes item from cart
 */
export const handleBuyNow = async (
  productId: number,
  quantity: number,
  setCart: React.Dispatch<React.SetStateAction<any[]>>
) => {
  try {
    const userId = getUserId();

    // 1. Create order
    await fetch(`${API_BASE}/orders/ordersList   `, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        totalItems: 1,
        totalQuantity: quantity,
      }),
    });

    // 2. Remove item from cart
    await fetch(`${API_BASE}/cart/${userId}/${productId}`, {
      method: "DELETE",
    });

    // 3. Refresh cart
    const res = await fetch(`${API_BASE}/cart/${userId}`);
    const updatedCart = await res.json();
    setCart(updatedCart);

    alert("Order placed successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to place order");
  }
};

/**
 * BUY SELECTED ITEMS
 */
export const handleBuySelected = async (
  selectedItems: { productId: number; quantity: number }[],
  setCart: React.Dispatch<React.SetStateAction<any[]>>,
  setSelectedItems: React.Dispatch<React.SetStateAction<any[]>>
) => {
  if (selectedItems.length === 0) {
    alert("No items selected.");
    return;
  }

  try {
    const userId = getUserId();

    const totalItems = selectedItems.length;
    const totalQuantity = selectedItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    // 1. Create ONE order
    await fetch(`${API_BASE}/orders/ordersList`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        totalItems,
        totalQuantity,
      }),
    });

    // 2. Remove items from cart
    for (const item of selectedItems) {
      await fetch(`${API_BASE}/cart/${userId}/${item.productId}`, {
        method: "DELETE",
      });
    }

    // 3. Refresh cart
    const res = await fetch(`${API_BASE}/cart/${userId}`);
    const updatedCart = await res.json();

    setCart(updatedCart);
    setSelectedItems([]);

    alert("Order placed successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to place order");
  }
};

/**
 * GET ORDERS (Orders Page)
 */
export const fetchOrders = async () => {
  const res = await fetch(`${API_BASE}/orders/ordersList`);
  return res.json();
};
