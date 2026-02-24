"use client";

import { useEffect, useState } from "react";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  PhilippinePeso,
  Box,
  Trophy,
  Crown,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  fetchDashboardData,
  type DashboardStats,
  type SalesDataPoint,
  type CategoryDataPoint,
  type TopProduct,
  type TopCategory,
  type TopRevenueDay,
  type TopUser,
} from "../../../handlers/pageHandlers/adminHomeHandlers";

function Home() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    todayRevenue: 0,
  });
  const [salesData, setSalesData] = useState<SalesDataPoint[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryDataPoint[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [topCategories, setTopCategories] = useState<TopCategory[]>([]);
  const [topRevenueDay, setTopRevenueDay] = useState<TopRevenueDay | null>(
    null,
  );
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchDashboardData();
        setStats(data.stats);
        setSalesData(data.salesData);
        setCategoryData(data.categoryData);
        setTopProducts(data.topProducts);
        setTopCategories(data.topCategories);
        setTopRevenueDay(data.topRevenueDay);
        setTopUsers(data.topUsers);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <main className="p-6 bg-background min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">
          Loading dashboard...
        </p>
      </main>
    );
  }

  return (
    <main className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ── Header ── */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your store performance
          </p>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">
                Total Products
              </p>
              <Box className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-card-foreground">
              {stats.totalProducts}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Active inventory
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">
                Total Orders
              </p>
              <ShoppingCart className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-card-foreground">
              {stats.totalOrders}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Completed orders
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </p>
              <PhilippinePeso className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-card-foreground">
              ₱{stats.totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Total earnings</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">
                Today's Revenue
              </p>
              <Users className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-card-foreground">
              ₱{stats.todayRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Earnings today</p>
          </div>
        </div>

        {/* ── Charts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-card-foreground">
                Sales Trend
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Orders"
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--chart-2, #10b981))"
                  strokeWidth={2}
                  name="Revenue (₱)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Package className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-card-foreground">
                Products by Category
              </h2>
            </div>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--primary))"
                    name="Products"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No category data available
              </div>
            )}
          </div>
        </div>

        {/* ── Leaderboards ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-card-foreground">
                Top Products
              </h2>
              <span className="ml-auto text-xs text-muted-foreground">
                By Revenue
              </span>
            </div>

            {topProducts.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No order data yet
              </div>
            ) : (
              <div className="space-y-3">
                {topProducts.map((product, i) => (
                  <div
                    key={product.productName}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors"
                  >
                    {/* Rank badge */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        i === 0
                          ? "bg-yellow-400/20 text-yellow-600"
                          : i === 1
                            ? "bg-gray-300/30 text-gray-600"
                            : i === 2
                              ? "bg-orange-400/20 text-orange-600"
                              : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {product.productName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.totalQuantitySold} units sold
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-semibold text-foreground">
                        ₱{product.totalRevenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Categories */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Package className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-card-foreground">
                Top Categories
              </h2>
              <span className="ml-auto text-xs text-muted-foreground">
                By Revenue
              </span>
            </div>
            {topCategories.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No order data yet
              </div>
            ) : (
              <div className="space-y-3">
                {topCategories.map((cat, i) => (
                  <div
                    key={cat.categoryName}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors"
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        i === 0
                          ? "bg-yellow-400/20 text-yellow-600"
                          : i === 1
                            ? "bg-gray-300/30 text-gray-600"
                            : i === 2
                              ? "bg-orange-400/20 text-orange-600"
                              : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {cat.categoryName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {cat.totalQuantitySold} units sold
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-foreground">
                        ₱{cat.totalRevenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Revenue Day */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-card-foreground">
                Best Sales Day
              </h2>
              <span className="ml-auto text-xs text-muted-foreground">
                By Revenue
              </span>
            </div>
            {!topRevenueDay ? (
              <div className="py-8 text-center text-muted-foreground">
                No order data yet
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center py-6 rounded-lg bg-muted/40">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-foreground mb-1">
                      ₱{topRevenueDay.totalRevenue.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(topRevenueDay.date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between px-2 text-sm">
                  <div className="text-center">
                    <p className="text-muted-foreground">Orders that day</p>
                    <p className="text-xl font-semibold text-foreground">
                      {topRevenueDay.totalOrders}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Avg per order</p>
                    <p className="text-xl font-semibold text-foreground">
                      ₱
                      {(
                        topRevenueDay.totalRevenue / topRevenueDay.totalOrders
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Top Users */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Crown className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-card-foreground">
                Top Users
              </h2>
              <span className="ml-auto text-xs text-muted-foreground">
                By Total Spent
              </span>
            </div>

            {topUsers.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No order data yet
              </div>
            ) : (
              <div className="space-y-3">
                {topUsers.map((user, i) => (
                  <div
                    key={user.userId}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors"
                  >
                    {/* Rank badge */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        i === 0
                          ? "bg-yellow-400/20 text-yellow-600"
                          : i === 1
                            ? "bg-gray-300/30 text-gray-600"
                            : i === 2
                              ? "bg-orange-400/20 text-orange-600"
                              : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </div>

                    {/* User avatar placeholder */}
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {user.userId}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.totalOrders} order
                        {user.totalOrders !== 1 ? "s" : ""}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-semibold text-foreground">
                        ₱{user.totalSpent.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
