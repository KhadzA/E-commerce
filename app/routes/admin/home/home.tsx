"use client";

import { useEffect, useState } from "react";
import {
  Package,
  Minus,
  Plus,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  Users,
  PhilippinePeso,
  Box,
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
  handleQuantity,
  handleQuickAddToCart,
  handleQuickBuy,
} from "../../../handlers/admin/adminHomeHandlers";

function Home() {
  const [recommended, setRecommended] = useState<any[]>([]);
  const [quantities, setQuantities] = useState<number[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    cartItems: 0,
  });
  const [salesData, setSalesData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");

    setStats({
      totalProducts: storedProducts.length,
      totalOrders: storedOrders.length,
      totalRevenue: storedOrders.length * 1250, // Mock revenue calculation
      cartItems: storedCart.length,
    });

    setSalesData([
      { month: "Jan", orders: 12, revenue: 15000 },
      { month: "Feb", orders: 19, revenue: 23750 },
      { month: "Mar", orders: 15, revenue: 18750 },
      { month: "Apr", orders: 25, revenue: 31250 },
      { month: "May", orders: 22, revenue: 27500 },
      {
        month: "Jun",
        orders: storedOrders.length,
        revenue: storedOrders.length * 1250,
      },
    ]);

    const categories = storedProducts.reduce((acc: any, product: any) => {
      const cat = product.category || "Uncategorized";
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    setCategoryData(
      Object.entries(categories).map(([name, count]) => ({ name, count }))
    );

    if (Array.isArray(storedProducts) && storedProducts.length > 0) {
      const shuffled = [...storedProducts].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);
      setRecommended(selected);
      setQuantities(selected.map(() => 1));
    } else {
      setRecommended([]);
      setQuantities([]);
    }
  }, []);

  return (
    <main className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your store performance
          </p>
        </div>

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
                Revenue
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
                Cart Items
              </p>
              <Users className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-card-foreground">
              {stats.cartItems}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Pending purchases
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Trend Chart */}
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
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution Chart */}
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
      </div>
    </main>
  );
}

export default Home;
