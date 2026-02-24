"use client";

import { useState, useEffect } from "react";
import { Package, Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import { fetchUserOrders } from "../../../handlers/pageHandlers/orderHandlers";

interface Order {
  orderId: number;
  userId: string;
  productId: number;
  productName: string;
  productPrice: number;
  totalItems: number;
  totalQuantity: number;
  totalPrice: number;
  status: string;
  date: string;
}

function CustomerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!userId) return;

    const loadOrders = async () => {
      try {
        const data = await fetchUserOrders(userId);
        setOrders(data.orders);
      } catch (err) {
        console.error(err);
        alert("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [userId]);

  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case "PLACED":
      case "COMPLETED":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "CANCELLED":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "PLACED":
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4" />;
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "CANCELLED":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading)
    return <p className="p-6 text-muted-foreground">Loading orders...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
          <p className="text-muted-foreground mt-1">
            Your personal order history
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Total Orders:{" "}
          <span className="font-semibold text-foreground">{orders.length}</span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-card rounded-lg border border-border">
          <Package className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No orders yet
          </h3>
          <p className="text-muted-foreground text-center max-w-md">
            Your order history will appear here once you make a purchase.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow"
            >
              {/* ── Header ── */}
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-foreground">
                      ORD-{String(order.orderId).padStart(4, "0")}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(order.status)}`}
                    >
                      <span className="flex items-center gap-1.5">
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {order.date
                        ? new Date(order.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "No date"}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-muted-foreground mb-1">
                    Total
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    ₱{order.totalPrice.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* ── Order line item ── */}
              <div className="border-t border-border pt-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  Order Summary
                </h4>
                <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                      <Package className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {order.productName || "Unknown Product"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.totalQuantity} × ₱{order.productPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="font-semibold text-foreground">
                    ₱{order.totalPrice.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomerOrders;
