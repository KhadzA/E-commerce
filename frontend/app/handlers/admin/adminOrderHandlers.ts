const API_BASE = "http://localhost:5000";

// All orders — for admin use
export const fetchOrders = async () => {
  const res = await fetch(`${API_BASE}/orders/ordersList`);
  return res.json();
};

// Orders for a specific user — for customer use
export const fetchUserOrders = async (userId: string) => {
  const res = await fetch(`${API_BASE}/orders/user/${userId}`);
  return res.json();
};
