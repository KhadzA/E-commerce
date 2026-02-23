const API_BASE = "http://localhost:5000";

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  todayRevenue: number;
}

export interface SalesDataPoint {
  month: string;
  orders: number;
  revenue: number;
}

export interface CategoryDataPoint {
  name: string;
  count: number;
}

export interface TopProduct {
  productName: string;
  totalQuantitySold: number;
  totalRevenue: number;
}

export interface TopCategory {
  categoryName: string;
  totalQuantitySold: number;
  totalRevenue: number;
}

export interface TopRevenueDay {
  date: string;
  totalRevenue: number;
  totalOrders: number;
}

export interface TopUser {
  userId: string;
  totalOrders: number;
  totalSpent: number;
}

export interface DashboardData {
  stats: DashboardStats;
  salesData: SalesDataPoint[];
  categoryData: CategoryDataPoint[];
  topProducts: TopProduct[];
  topCategories: TopCategory[];
  topRevenueDay: TopRevenueDay | null;
  topUsers: TopUser[];
}

// Month label helper
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const fetchDashboardData = async (): Promise<DashboardData> => {
  const [productsRes, ordersRes] = await Promise.all([
    fetch(`${API_BASE}/products`),
    fetch(`${API_BASE}/orders/ordersList`),
  ]);

  if (!productsRes.ok) throw new Error("Failed to fetch products.");
  if (!ordersRes.ok) throw new Error("Failed to fetch orders.");

  const products: any[] = await productsRes.json();
  const { orders }: { orders: any[] } = await ordersRes.json();

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice ?? 0), 0);

  const todayStr = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const todayRevenue = orders
    .filter((o) => o.date && o.date.startsWith(todayStr))
    .reduce((sum, o) => sum + (o.totalPrice ?? 0), 0);

  const stats: DashboardStats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    todayRevenue,
  };

  // ── Sales trend — group orders by real date (last 6 months) ────────────────
  const monthlyMap: Record<string, { orders: number; revenue: number }> = {};

  const now = new Date();
  const last6Months: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    last6Months.push(key);
    monthlyMap[key] = { orders: 0, revenue: 0 };
  }

  orders.forEach((o) => {
    if (!o.date) return;
    const key = o.date.slice(0, 7); // "YYYY-MM"
    if (monthlyMap[key]) {
      monthlyMap[key].orders += 1;
      monthlyMap[key].revenue += o.totalPrice ?? 0;
    }
  });

  const salesData: SalesDataPoint[] = last6Months.map((key) => ({
    month: MONTH_LABELS[parseInt(key.slice(5, 7)) - 1],
    orders: monthlyMap[key].orders,
    revenue: parseFloat(monthlyMap[key].revenue.toFixed(2)),
  }));

  // ── Category distribution from products ────────────────────────────────────
  const catMap: Record<string, number> = {};
  products.forEach((p) => {
    const cat = p.category?.trim() || "Uncategorized";
    catMap[cat] = (catMap[cat] || 0) + 1;
  });
  const categoryData: CategoryDataPoint[] = Object.entries(catMap).map(
    ([name, count]) => ({ name, count }),
  );

  // ── Top products by total revenue from orders ──────────────────────────────
  const productMap: Record<string, TopProduct> = {};
  orders.forEach((o) => {
    const key = o.productName || `Product #${o.productId}`;
    if (!productMap[key]) {
      productMap[key] = {
        productName: key,
        totalQuantitySold: 0,
        totalRevenue: 0,
      };
    }
    productMap[key].totalQuantitySold += o.totalQuantity ?? 0;
    productMap[key].totalRevenue += o.totalPrice ?? 0;
  });
  const topProducts: TopProduct[] = Object.values(productMap)
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5)
    .map((p) => ({
      ...p,
      totalRevenue: parseFloat(p.totalRevenue.toFixed(2)),
    }));

  // ── Top categories by total revenue from orders ───────────────────────────
  const categoryRevenueMap: Record<string, TopCategory> = {};
  orders.forEach((o) => {
    const cat = (o.category as string)?.trim() || "Uncategorized";
    if (!categoryRevenueMap[cat]) {
      categoryRevenueMap[cat] = {
        categoryName: cat,
        totalQuantitySold: 0,
        totalRevenue: 0,
      };
    }
    categoryRevenueMap[cat].totalQuantitySold += o.totalQuantity ?? 0;
    categoryRevenueMap[cat].totalRevenue += o.totalPrice ?? 0;
  });
  const topCategories: TopCategory[] = Object.values(categoryRevenueMap)
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5)
    .map((c) => ({
      ...c,
      totalRevenue: parseFloat(c.totalRevenue.toFixed(2)),
    }));

  // ── Top revenue day ──────────────────────────────────────────────────────
  const dayMap: Record<string, { totalRevenue: number; totalOrders: number }> =
    {};
  orders.forEach((o) => {
    if (!o.date) return;
    const day = o.date.slice(0, 10); // "YYYY-MM-DD"
    if (!dayMap[day]) dayMap[day] = { totalRevenue: 0, totalOrders: 0 };
    dayMap[day].totalRevenue += o.totalPrice ?? 0;
    dayMap[day].totalOrders += 1;
  });
  const topRevenueDay: TopRevenueDay | null =
    Object.keys(dayMap).length === 0
      ? null
      : Object.entries(dayMap)
          .map(([date, v]) => ({
            date,
            totalRevenue: parseFloat(v.totalRevenue.toFixed(2)),
            totalOrders: v.totalOrders,
          }))
          .sort((a, b) => b.totalRevenue - a.totalRevenue)[0];

  // ── Top users by total spending ────────────────────────────────────────────
  const userMap: Record<string, TopUser> = {};
  orders.forEach((o) => {
    const key = o.userId;
    if (!userMap[key]) {
      userMap[key] = { userId: key, totalOrders: 0, totalSpent: 0 };
    }
    userMap[key].totalOrders += 1;
    userMap[key].totalSpent += o.totalPrice ?? 0;
  });
  const topUsers: TopUser[] = Object.values(userMap)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5)
    .map((u) => ({ ...u, totalSpent: parseFloat(u.totalSpent.toFixed(2)) }));

  return {
    stats,
    salesData,
    categoryData,
    topProducts,
    topCategories,
    topRevenueDay,
    topUsers,
  };
};
