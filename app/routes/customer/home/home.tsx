"use client";

import { useEffect, useState } from "react";
import { Package, Minus, Plus, ShoppingCart, CreditCard } from "lucide-react";
import {
  handleQuantity,
  handleQuickAddToCart,
  handleQuickBuy,
} from "../../../handlers/admin/adminHomeHandlers";

function Home() {
  const [recommended, setRecommended] = useState<any[]>([]);
  const [quantities, setQuantities] = useState<number[]>([]);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome, </h1>
          <p className="text-muted-foreground">
            Discover our recommended products just for you
          </p>
        </div>

        {recommended.length > 0 ? (
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Recommended Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommended.map((product, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <Package className="w-12 h-12 text-muted-foreground" />
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg text-card-foreground mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {product.category}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Stock:{" "}
                        <span className="font-medium">{product.stock}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-3 py-2">
                      <button
                        onClick={() =>
                          handleQuantity(
                            index,
                            "minus",
                            recommended,
                            setQuantities
                          )
                        }
                        className="w-8 h-8 rounded-md bg-secondary hover:bg-secondary/80 text-secondary-foreground flex items-center justify-center transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-semibold text-foreground min-w-[2rem] text-center">
                        {quantities[index]}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantity(
                            index,
                            "add",
                            recommended,
                            setQuantities
                          )
                        }
                        className="w-8 h-8 rounded-md bg-secondary hover:bg-secondary/80 text-secondary-foreground flex items-center justify-center transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleQuickAddToCart(
                            index,
                            recommended,
                            quantities,
                            setQuantities
                          )
                        }
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md transition-colors font-medium"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                      <button
                        onClick={() =>
                          handleQuickBuy(
                            index,
                            recommended,
                            quantities,
                            setRecommended,
                            setQuantities
                          )
                        }
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors font-medium"
                      >
                        <CreditCard className="w-4 h-4" />
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              No products yet. Add some products to see recommendations.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default Home;
