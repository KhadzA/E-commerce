"use client";

import { useState, useEffect } from "react";
import {
  handleFetchProducts,
  handleAddCart,
  handleBuyNow,
  handleQuantity,
  handleSearchProduct,
} from "../../../handlers/admin/adminProductHandlers";
import { Plus, Minus, ShoppingCart, Package, Search } from "lucide-react";

function CustomerProduct() {
  const [products, setProducts] = useState<
    {
      id: number;
      name: string;
      stock: number;
      price: number;
      category: string;
    }[]
  >([]);

  const [quantity, setQuantity] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await handleFetchProducts(setProducts, setQuantity);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    handleSearchProduct(searchTerm, products, setFilteredProducts);
  }, [products]);

  return (
    <div className="mt-5 p-6 max-w-7xl mx-auto">
      {/* ── Search ── */}
      <div className="bg-card border border-border rounded-lg p-4 mb-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or category..."
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value;
              setSearchTerm(value);
              handleSearchProduct(value, products, setFilteredProducts);
            }}
            className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground animate-pulse">
            Loading products...
          </p>
        </div>
      )}

      {/* ── Product Grid ── */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((prod, index) => {
            const outOfStock = prod.stock === 0;
            return (
              <div
                key={prod.id}
                className={`bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                  outOfStock ? "border-border opacity-60" : "border-border"
                }`}
              >
                {/* Product image placeholder */}
                <div className="aspect-video bg-muted flex items-center justify-center relative">
                  <Package className="w-10 h-10 text-muted-foreground" />
                  {outOfStock && (
                    <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                      <span className="text-xs font-semibold text-destructive bg-destructive/10 px-2 py-1 rounded">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground truncate">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {prod.category || "Uncategorized"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-xl font-bold text-foreground">
                      ₱{prod.price?.toFixed(2) ?? "—"}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        outOfStock
                          ? "bg-red-500/10 text-red-500"
                          : prod.stock <= 5
                            ? "bg-orange-500/10 text-orange-600"
                            : "bg-green-500/10 text-green-600"
                      }`}
                    >
                      {outOfStock
                        ? "Out of stock"
                        : prod.stock <= 5
                          ? `Only ${prod.stock} left`
                          : `${prod.stock} in stock`}
                    </span>
                  </div>

                  {/* Quantity controls */}
                  {!outOfStock && (
                    <>
                      <div className="flex items-center justify-center gap-3 py-1">
                        <button
                          onClick={() =>
                            handleQuantity(
                              index,
                              "minus",
                              products,
                              setQuantity,
                            )
                          }
                          className="w-8 h-8 rounded-full bg-secondary hover:bg-secondary/80 transition-colors flex items-center justify-center"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-lg font-semibold text-foreground min-w-[2rem] text-center">
                          {quantity[index] ?? 1}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantity(index, "add", products, setQuantity)
                          }
                          className="w-8 h-8 rounded-full bg-secondary hover:bg-secondary/80 transition-colors flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleAddCart(index, products, quantity)
                          }
                          className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </button>
                        <button
                          onClick={() =>
                            handleBuyNow(index, products, quantity, setProducts)
                          }
                          className="flex-1 px-3 py-2 bg-accent text-accent-foreground rounded hover:bg-accent/90 transition-colors text-sm font-medium"
                        >
                          Buy Now
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchTerm
              ? "No products match your search"
              : "No products available"}
          </h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? "Try a different search term"
              : "Check back later for new products"}
          </p>
        </div>
      )}
    </div>
  );
}

export default CustomerProduct;
