const API_BASE = "http://localhost:5000";

const getUserId = () => {
  const userId = localStorage.getItem("userId");
  if (!userId) throw new Error("User not logged in");
  return userId;
};

export const handleBuyNow = async (
  productId: number,
  setCart: React.Dispatch<React.SetStateAction<any[]>>
) => {
  try {
    const userId = getUserId();

    await fetch(`${API_BASE}/cart/${userId}/${productId}`, {
      method: "DELETE",
    });

    const res = await fetch(`${API_BASE}/cart/${userId}`); //YOU MIGHT WANNA PUT THE PATH HERE AS THE SPECIFIED PATH IN THE cartController.js IN THE BACKEND ‼️‼️‼️‼️‼
    const updatedCart = await res.json();
    setCart(updatedCart);

    alert("Order placed (mock)");
  } catch (err) {
    console.error(err);
    alert("Failed to process order");
  }
};

export const handleBuySelected = async (
  selectedProductIds: number[],
  setCart: React.Dispatch<React.SetStateAction<any[]>>,
  setSelectedItems: React.Dispatch<React.SetStateAction<number[]>>
) => {
  if (selectedProductIds.length === 0) {
    alert("No items selected.");
    return;
  }

  try {
    const userId = getUserId();

    for (const productId of selectedProductIds) {
      await fetch(`${API_BASE}/cart/${userId}/${productId}`, {
        method: "DELETE",
      });
    }

    const res = await fetch(`${API_BASE}/cart/${userId}`);
    const updatedCart = await res.json();

    setCart(updatedCart);
    setSelectedItems([]);

    alert("Order placed (mock)");
  } catch (err) {
    console.error(err);
    alert("Failed to process selected items");
  }
};

export const handleQuantity = async (
  productId: number,
  type: "add" | "minus",
  currentQuantity: number,
  setCart: React.Dispatch<React.SetStateAction<any[]>>
) => {
  try {
    const userId = getUserId();
    const newQuantity =
      type === "add" ? currentQuantity + 1 : currentQuantity - 1;

    if (newQuantity <= 0) {
      // remove item if quantity goes to 0
      await fetch(`${API_BASE}/cart/${userId}/${productId}`, {
        method: "DELETE",
      });
    } else {
      await fetch(`${API_BASE}/cart/${userId}/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });
    }

    // Refresh cart
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
  setSelectedItems: React.Dispatch<React.SetStateAction<number[]>>
) => {
  setSelectedItems((prev) =>
    prev.includes(productId)
      ? prev.filter((id) => id !== productId)
      : [...prev, productId]
  );
};
