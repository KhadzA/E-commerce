"use client";

import { useState, useEffect } from "react";
import {
  handleAddCart,
  handleBuyNow,
  handleQuantity,
  handleSearchProduct,
} from "../../../handlers/customer/customerProductHandlers";
import { Plus, Minus, ShoppingCart, Package, Search } from "lucide-react";

function Product() {
  const [products, setProducts] = useState<
    {
      name: string;
      stock: number;
      category: string;
    }[]
  >([]);

  const [quantity, setQuantity] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Load products from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("products") || "[]");
    setProducts(stored);
    setQuantity(stored.map(() => 1)); // init each product with qty = 1
  }, []);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  return (
    <div className="mt-5 p-6 max-w-7xl mx-auto">
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

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((prod, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-4 border-b border-border flex items-center gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-foreground">
                  {prod.name}
                </h3>
              </div>
            </div>

            <div className="aspect-video bg-muted flex items-center justify-center">
              <Package className="w-10 h-10 text-muted-foreground" />
            </div>

            <div className="p-4 space-y-3">
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Stock:</span>
                  <span className="font-medium text-foreground">
                    {prod.stock}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium text-foreground">
                    {prod.category}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-3 py-2">
                  <button
                    onClick={() =>
                      handleQuantity(index, "minus", products, setQuantity)
                    }
                    className="w-8 h-8 rounded-full bg-secondary hover:bg-secondary/80 transition-colors flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-semibold text-foreground min-w-[2rem] text-center">
                    {quantity[index]}
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
                    onClick={() => handleAddCart(index, products, quantity)}
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
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No products yet
          </h3>
        </div>
      )}
    </div>
  );
}

export default Product;
