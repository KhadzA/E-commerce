import { useEffect, useState } from "react";
import {
  handleBuyNow,
  handleBuySelected,
  handleQuantity,
  toggleSelection,
} from "../../../handlers/admin/adminCartHandlers";

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
    <div>
      <div className="cartList">
        {cart.map((item, index) => {
          const product = products.find((p) => p.name === item.name);
          return (
            <div key={index}>
              <input
                type="checkbox"
                checked={selectedItems.includes(item.name)}
                onChange={() => toggleSelection(item.name, setSelectedItems)}
              />
              <span className="product-images">img</span>
              <br />
              {item.name}
              <br />
              <small>Stock: {product ? product.stock : "?"}</small>
              <div
                style={{ display: "flex", alignItems: "center", gap: ".5rem" }}
              >
                <button
                  onClick={() =>
                    handleQuantity(index, "minus", cart, setCart, products)
                  }
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button
                  onClick={() =>
                    handleQuantity(index, "add", cart, setCart, products)
                  }
                >
                  +
                </button>
              </div>
              <button
                onClick={() =>
                  handleBuyNow(index, cart, products, setProducts, setCart)
                }
              >
                Buy now
              </button>
            </div>
          );
        })}
      </div>

      <br />

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
      >
        Buy Selected
      </button>
    </div>
  );
}

export default Cart;
