import { use, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
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
} from "../../../handlers/admin/adminProductHandlers";

function Product() {
  const [products, setProducts] = useState<
    {
      name: string;
      stock: number;
      category: string;
    }[]
  >([]);

  const [quantity, setQuantity] = useState<number[]>([]);
  const [productName, setProduct] = useState("");
  const [stock, setStock] = useState<number | "">("");
  const [productCategory, setProductCategory] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    stock: 0,
    category: "",
  });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Load products from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("products") || "[]");
    setProducts(stored);
    setQuantity(stored.map(() => 1)); // init each product with qty = 1
  }, []);

  return (
    <div>
      <div className="addProduct">
        <label>Product name:</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProduct(e.target.value)}
        />
        <br />
        <label>Product stock:</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => {
            const val = e.target.value;
            setStock(val === "" ? "" : Number(val));
          }}
        />
        <br />
        <label>Product category:</label>
        <input
          type="text"
          value={productCategory}
          onChange={(e) => setProductCategory(e.target.value)}
        />
      </div>

      <button
        onClick={() =>
          handleAddProduct(
            productName,
            Number(stock),
            productCategory,
            setProducts,
            setQuantity,
            setProduct,
            setStock,
            setProductCategory
          )
        }
      >
        Add Product
      </button>

      <div className="productList">
        <ul className="productList">
          {products.map((prod, index) => (
            <li key={index}>
              <input
                type="checkbox"
                checked={selectedItems.includes(prod.name)}
                onChange={() => toggleSelection(prod.name, setSelectedItems)}
              />

              <div
                className="product-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "2rem",
                }}
              >
                <span className="productImage">img</span>

                {editIndex === index ? (
                  <div>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
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
                    />
                    <input
                      type="text"
                      value={editForm.category}
                      onChange={(e) =>
                        setEditForm({ ...editForm, category: e.target.value })
                      }
                    />
                    <button
                      onClick={() =>
                        handleSaveEdit(
                          editIndex,
                          editForm,
                          products,
                          setProducts,
                          setEditIndex,
                          setEditForm
                        )
                      }
                    >
                      Save
                    </button>
                    <button
                      onClick={() =>
                        handleCancelEdit(setEditIndex, setEditForm)
                      }
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <p>{prod.name}</p>
                    <span>Stock: {prod.stock}</span>
                    <span>Category: {prod.category}</span>
                    <button
                      onClick={() =>
                        handleEditProduct(
                          index,
                          products,
                          setEditIndex,
                          setEditForm
                        )
                      }
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteProduct(prod.name, products, setProducts)
                      }
                    >
                      Delete
                    </button>
                  </>
                )}

                <p>{prod.name}</p>

                <span className="productStock">Stock: {prod.stock}</span>
                <span className="productCategory">
                  Caterogy: {prod.category}
                </span>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".5rem",
                  }}
                >
                  <button
                    onClick={() =>
                      handleQuantity(index, "minus", products, setQuantity)
                    }
                  >
                    -
                  </button>
                  <span className="quantity">{quantity[index]}</span>
                  <button
                    onClick={() =>
                      handleQuantity(index, "add", products, setQuantity)
                    }
                  >
                    +
                  </button>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <button
                    onClick={() => handleAddCart(index, products, quantity)}
                  >
                    Add to cart
                  </button>
                  <button
                    onClick={() =>
                      handleBuyNow(index, products, quantity, setProducts)
                    }
                  >
                    Buy now
                  </button>
                </div>

                <br />

                <button
                  onClick={() =>
                    handleDeleteProduct(prod.name, products, setProducts)
                  }
                >
                  Delete
                </button>

                <button
                  onClick={() =>
                    handleEditProduct(
                      index,
                      products,
                      setEditIndex,
                      setEditForm
                    )
                  }
                >
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() =>
          handleDeleteSelected(
            selectedItems,
            products,
            setProducts,
            setSelectedItems,
          )
        }
      >
        Delete selected Product(s)
      </button>
    </div>
  );
}

export default Product;
