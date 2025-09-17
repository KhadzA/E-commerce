import { useEffect, useState } from "react";

function Cart() {
  const [cart, setCart] = useState<{ name: string; quantity: number }[]>([]);
  const [products, setProducts] = useState<{ name: string; stock: number }[]>([]);  

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


  return (
    <div>
      <div className="cartList">
        {cart.map((item, index) => {
          const product = products.find((p) => p.name === item.name);
          return (
            <div key={index}>
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
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default Cart;
