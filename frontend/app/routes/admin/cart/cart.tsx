"use client";

import { useEffect, useState } from "react";
import {
  handleBuyNow,
  handleBuySelected,
  handleQuantity,
  toggleSelection,
} from "../../../handlers/admin/adminCartHandlers";
import { Minus, Plus, ShoppingCart, Package } from "lucide-react";

interface CartItem {
  productId: number;
  quantity: number;
}

interface Product {
  id: number;
  name: string;
  stock: number;
}

function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("userId");
      setUserId(id);
    }
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      if (!userId) return;

      const cartRes = await fetch(`http://localhost:5000/cart/${userId}`);
      const cartData = await cartRes.json();
      setCart(cartData);

      const productRes = await fetch(`http://localhost:5000/products`);
      const productData = await productRes.json();
      setProducts(productData);
    };

    loadCart();
  }, [userId]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
        </div>
        {selectedItems.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {selectedItems.length} item
            {selectedItems.length > 1 ? "s" : ""} selected
          </span>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cart.map((item) => {
              const product = products.find((p) => p.id === item.productId);

              const isSelected = selectedItems.includes(item.productId);

              return (
                <div
                  key={item.productId}
                  className={`bg-card border rounded-lg p-4 transition-all hover:shadow-md ${
                    isSelected
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() =>
                        toggleSelection(item.productId, setSelectedItems)
                      }
                      className="w-5 h-5"
                    />

                    <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                      <Package className="w-10 h-10 text-muted-foreground" />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {product?.name || "Unknown Product"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Stock: {product?.stock ?? "?"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                      <button
                        onClick={() =>
                          handleQuantity(
                            item.productId,
                            "minus",
                            item.quantity,
                            setCart,
                          )
                        }
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="w-12 text-center font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          handleQuantity(
                            item.productId,
                            "add",
                            item.quantity,
                            setCart,
                          )
                        }
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleBuyNow(item.productId, setCart)}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="sticky bottom-0 bg-card border-t border-border p-4 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <span>{selectedItems.length} selected</span>

              <button
                onClick={() =>
                  handleBuySelected(selectedItems, setCart, setSelectedItems)
                }
                disabled={selectedItems.length === 0}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg"
              >
                Buy Selected
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
