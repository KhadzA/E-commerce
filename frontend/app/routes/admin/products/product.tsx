"use client";

import { useState, useEffect } from "react";
import {
  handleFetchProducts,
  handleAddProduct,
  handleAddCart,
  handleBuyNow,
  handleQuantity,
  toggleSelection,
  handleDeleteSelected,
  handleDeleteProduct,
  handleEditProduct,
  handleSaveEdit,
  handleCancelEdit,
  handleSearchProduct,
} from "../../../handlers/admin/adminProductHandlers";
import {
  Plus,
  Minus,
  ShoppingCart,
  Trash2,
  Edit2,
  Save,
  X,
  Package,
  Search,
} from "lucide-react";

function Product() {
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
  const [productName, setProduct] = useState("");
  const [stock, setStock] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");
  const [productCategory, setProductCategory] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    stock: 0,
    price: 0,
    category: "",
  });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend on mount
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await handleFetchProducts(setProducts, setQuantity);
      setLoading(false);
    };
    load();
  }, []);

  // Keep filtered list in sync with products
  useEffect(() => {
    handleSearchProduct(searchTerm, products, setFilteredProducts);
  }, [products]);

  return (
    <div className="mt-5 p-6 max-w-7xl mx-auto">
      {/* ── Add Product Form ── */}
      <div className="bg-card border border-border rounded-lg p-6 mb-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <Package className="w-6 h-6" />
          Add New Product
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Product Name
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              placeholder="Enter product name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => {
                const val = e.target.value;
                setPrice(val === "" ? "" : Number(val));
              }}
              className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              placeholder="Enter price"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Stock Quantity
            </label>
            <input
              type="number"
              value={stock}
              onChange={(e) => {
                const val = e.target.value;
                setStock(val === "" ? "" : Number(val));
              }}
              className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              placeholder="Enter stock"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Category
            </label>
            <input
              type="text"
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              placeholder="Enter category"
            />
          </div>
        </div>
        <button
          onClick={() =>
            handleAddProduct(
              productName,
              Number(stock),
              productCategory,
              Number(price),
              setProducts,
              setQuantity,
              setProduct,
              setStock,
              setProductCategory,
              setPrice,
            )
          }
          className="w-full md:w-auto px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

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

      {/* ── Bulk Delete ── */}
      {selectedItems.length > 0 && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={() =>
              handleDeleteSelected(
                selectedItems,
                products,
                setProducts,
                setSelectedItems,
              )
            }
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors font-medium flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected ({selectedItems.length})
          </button>
        </div>
      )}

      {/* ── Loading State ── */}
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
          {filteredProducts.map((prod, index) => (
            <div
              key={prod.id}
              className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-4 border-b border-border flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(prod.name)}
                  onChange={() => toggleSelection(prod.name, setSelectedItems)}
                  className="w-4 h-4 rounded border-input"
                />
                <div className="flex-1">
                  {editIndex === index ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full px-3 py-1 bg-background border border-input rounded text-foreground"
                    />
                  ) : (
                    <h3 className="font-semibold text-lg text-foreground">
                      {prod.name}
                    </h3>
                  )}
                </div>
              </div>

              <div className="aspect-video bg-muted flex items-center justify-center">
                <Package className="w-10 h-10 text-muted-foreground" />
              </div>

              <div className="p-4 space-y-3">
                {editIndex === index ? (
                  <div className="space-y-2">
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          price: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-1 bg-background border border-input rounded text-foreground"
                      placeholder="Price"
                    />
                    <input
                      type="number"
                      value={editForm.stock}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          stock: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-1 bg-background border border-input rounded text-foreground"
                      placeholder="Stock"
                    />
                    <input
                      type="text"
                      value={editForm.category}
                      onChange={(e) =>
                        setEditForm({ ...editForm, category: e.target.value })
                      }
                      className="w-full px-3 py-1 bg-background border border-input rounded text-foreground"
                      placeholder="Category"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleSaveEdit(
                            editIndex,
                            editForm,
                            products,
                            setProducts,
                            setEditIndex,
                            setEditForm,
                          )
                        }
                        className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={() =>
                          handleCancelEdit(setEditIndex, setEditForm)
                        }
                        className="flex-1 px-3 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-medium text-foreground">
                        ₱{prod.price?.toFixed(2) ?? "—"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Stock:</span>
                      <span className="font-medium text-foreground">
                        {prod.stock}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-medium text-foreground">
                        {prod.category || "—"}
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

                    <div className="flex gap-2 pt-2 border-t border-border">
                      <button
                        onClick={() =>
                          handleEditProduct(
                            index,
                            products,
                            setEditIndex,
                            setEditForm,
                          )
                        }
                        className="flex-1 px-3 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteProduct(prod.id, setProducts, setQuantity)
                        }
                        className="flex-1 px-3 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && products.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No products yet
          </h3>
          <p className="text-muted-foreground">
            Add your first product using the form above
          </p>
        </div>
      )}
    </div>
  );
}

export default Product;
