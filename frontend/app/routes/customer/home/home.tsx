"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ShoppingCart, Package, Star, ArrowRight, Inbox } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
}

interface CartItem {
  productId: number;
  quantity: number;
}

interface Order {
  orderId: number;
  status: string;
}

function CustomerHome() {
  const [products, setProducts] = useState<Product[]>([]);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    setUserName(localStorage.getItem("userName") || "");

    const load = async () => {
      try {
        const [productsRes, cartRes, ordersRes] = await Promise.all([
          fetch("http://localhost:5000/products"),
          fetch(`http://localhost:5000/cart/${userId}`),
          fetch("http://localhost:5000/orders/ordersList"),
        ]);

        const productsData: Product[] = await productsRes.json();
        const cartData: CartItem[] = await cartRes.json();
        const ordersData = await ordersRes.json();

        const inStockProducts = productsData.filter((p) => p.stock > 0);
        const shuffled = [...inStockProducts].sort(() => Math.random() - 0.5);

        setProducts(productsData);
        setRecommended(shuffled.slice(0, 4));
        setCart(cartData);

        // Filter orders for this user only
        const userOrders = (ordersData.orders || []).filter(
          (o: any) => String(o.userId) === String(userId),
        );
        setOrders(userOrders);
      } catch (err) {
        console.error("Failed to load customer home:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const getAvatar = (name: string) =>
    name?.trim() ? name.trim()[0].toUpperCase() : "?";

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">
        {/* ── Greeting ── */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Welcome back,</p>
            <h1 className="text-3xl font-bold text-foreground">
              {userName || "Customer"}
            </h1>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
            <span className="text-xl font-bold text-primary">
              {getAvatar(userName)}
            </span>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Cart */}
          <button
            onClick={() => navigate("/customer/cart")}
            className="group bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-primary" />
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {totalCartItems}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Item{totalCartItems !== 1 ? "s" : ""} in cart
            </p>
          </button>

          {/* Orders */}
          <button
            onClick={() => navigate("/customer/orders")}
            className="group bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {orders.length}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Total order{orders.length !== 1 ? "s" : ""}
            </p>
          </button>

          {/* Available Products */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Inbox className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {products.filter((p) => p.stock > 0).length}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Products available
            </p>
          </div>
        </div>

        {/* ── Recommended Products ── */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Recommended for You
              </h2>
            </div>
            <button
              onClick={() => navigate("/customer/products")}
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recommended.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>No products available right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recommended.map((product) => {
                const inCart = cart.find((c) => c.productId === product.id);
                return (
                  <div
                    key={product.id}
                    className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/30 transition-all group"
                  >
                    {/* Placeholder image */}
                    <div className="aspect-square bg-muted flex items-center justify-center group-hover:bg-muted/70 transition-colors">
                      <Package className="w-12 h-12 text-muted-foreground/50" />
                    </div>

                    <div className="p-4 space-y-2">
                      <div>
                        <h3 className="font-semibold text-foreground truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {product.category || "Uncategorized"}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-foreground">
                          ₱{product.price.toFixed(2)}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            product.stock <= 5
                              ? "bg-orange-500/10 text-orange-600"
                              : "bg-green-500/10 text-green-600"
                          }`}
                        >
                          {product.stock <= 5
                            ? `Only ${product.stock} left`
                            : `${product.stock} in stock`}
                        </span>
                      </div>

                      {inCart && (
                        <p className="text-xs text-primary font-medium">
                          ✓ {inCart.quantity} in your cart
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Recent Orders ── */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Recent Orders
              </h2>
            </div>
            {orders.length > 3 && (
              <button
                onClick={() => navigate("/customer/orders")}
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                View all
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {orders.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>No orders yet. Start shopping!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 3).map((order: any) => (
                <div
                  key={order.orderId}
                  className="bg-card border border-border rounded-xl px-5 py-4 flex items-center justify-between hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        ORD-{String(order.orderId).padStart(4, "0")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.productName || "Product"} · {order.totalQuantity}{" "}
                        unit{order.totalQuantity !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      ₱{(order.totalPrice ?? 0).toFixed(2)}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        order.status === "PLACED" ||
                        order.status === "COMPLETED"
                          ? "bg-green-500/10 text-green-600"
                          : order.status === "CANCELLED"
                            ? "bg-red-500/10 text-red-600"
                            : "bg-yellow-500/10 text-yellow-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default CustomerHome;
