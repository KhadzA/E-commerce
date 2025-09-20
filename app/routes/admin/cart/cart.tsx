import { useEffect, useState } from "react";

function Cart() {
  const [cart, setCart] = useState<{ name: string; quantity: number }[]>([]);
  const [products, setProducts] = useState<{ name: string; stock: number }[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]); // track selected product names

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    setProducts(storedProducts);
    setCart(storedCart);
  }, []);

  const handleQuantity = (index: number, type: "add" | "minus") => {
    setCart((prevCart) => {
      const newCart = [...prevCart];

      // find the matching product by name
      const product = products.find((p) => p.name === newCart[index].name);

      if (!product) return newCart;

      if (type === "add") {
        //prevent going over stock
        if (newCart[index].quantity < product.stock) {
          newCart[index] = {
            ...newCart[index],
            quantity: newCart[index].quantity + 1,
          };
        }
      } else if (type === "minus") {
        if (newCart[index].quantity > 1) {
          newCart[index] = {
            ...newCart[index],
            quantity: newCart[index].quantity - 1,
          };
        } else {
          // remove item if quantity reaches 0
          newCart.splice(index, 1);
        }
      }

      //update localStorage only once per state update
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  // toggle checkbox selection
  const toggleSelection = (name: string) => {
    setSelectedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name) // remove if already selected
        : [...prev, name] // add if not selected
    );
  };

  // buy selected items
  const handleBuySelected = () => {
    if (selectedItems.length === 0) {
      alert("No items selected.");
      return;
    }

    alert(`Buying: ${selectedItems.join(", ")}`);
  };

  const handleBuyNow = (index: number) => {
    const selectedProduct = {
      name: products[index].name, 
    };    

    alert(`Proceeding to buy ${selectedProduct.name}`);
  }


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
                onChange={() => toggleSelection(item.name)}
              />
              <span className="product-images">img</span>
              <br />
              {item.name}
              <br />
              <small>Stock: {product ? product.stock : "?"}</small>
              <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                <button onClick={() => handleQuantity(index, "minus")}>-</button>
                <span className="quantity">{item.quantity}</span>
                <button onClick={() => handleQuantity(index, "add")}>+</button>
              </div>
              <button onClick={() => handleBuyNow(index)}>Buy now</button>
            </div>
          );
        })}
      </div>
      
      <br />

      <button onClick={handleBuySelected} disabled={selectedItems.length === 0}>
        Buy Selected
      </button>
    </div>
  );
}

export default Cart;
