"use client";

import { useEffect, useState } from "react";
import {
  handleBuyNow,
  handleBuySelected,
  handleQuantity,
  toggleSelection,
} from "../../../handlers/admin/adminCartHandlers";
import { Minus, Plus, ShoppingCart, Package } from "lucide-react";

function Cart() {
  const [cart, setCart] = useState<{ name: string; quantity: number }[]>([]);
  const [products, setProducts] = useState<{ name: string; stock: number }[]>(
    []
  );
  const [selectedItems, setSelectedItems] = useState<string[]>([]); // track selected product names

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    setProducts(storedProducts);
    setCart(storedCart);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
        </div>
        {selectedItems.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {selectedItems.length} item{selectedItems.length > 1 ? "s" : ""}{" "}
            selected
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
            {cart.map((item, index) => {
              const product = products.find((p) => p.name === item.name);
              const isSelected = selectedItems.includes(item.name);

              return (
                <div
                  key={index}
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
                        toggleSelection(item.name, setSelectedItems)
                      }
                      className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
                    />

                    <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-10 h-10 text-muted-foreground" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-lg mb-1 truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Stock: {product ? product.stock : "?"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                      <button
                        onClick={() =>
                          handleQuantity(
                            index,
                            "minus",
                            cart,
                            setCart,
                            products
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-background transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-semibold text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantity(index, "add", cart, setCart, products)
                        }
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-background transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        handleBuyNow(
                          index,
                          cart,
                          products,
                          setProducts,
                          setCart
                        )
                      }
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Buy Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="sticky bottom-0 bg-card border-t border-border p-4 rounded-lg shadow-lg">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="text-sm text-muted-foreground">
                {selectedItems.length > 0 ? (
                  <span>
                    <strong className="text-foreground">
                      {selectedItems.length}
                    </strong>{" "}
                    item
                    {selectedItems.length > 1 ? "s" : ""} selected
                  </span>
                ) : (
                  <span>Select items to purchase</span>
                )}
              </div>
              <button
                onClick={() =>
                  handleBuySelected(
                    selectedItems,
                    products,
                    cart,
                    setProducts,
                    setCart,
                    setSelectedItems
                  )
                }
                disabled={selectedItems.length === 0}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
              >
                <ShoppingCart className="w-5 h-5" />
                Buy Selected ({selectedItems.length})
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
