import { useEffect, useState } from "react";

function Cart() {
  const [cart, setCart] = useState<{ name: string; quantity: number }[]>([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  const handleQuantity = (index: number, type: "add" | "minus") => {
    setCart((prevCart) => {
      const newCart = [...prevCart];
      
      if (type === "add") {
        newCart[index].quantity += .5;  //THIS DOES NOT MAKE SENSE BUT IT WORKS SO WHY NOT
      } else if (type === "minus" && newCart[index].quantity > 1) {
        newCart[index].quantity -= .5;  //WHY .5 MAAAN I DON'T WANNA THINK ABOUT IT
      } else {
        // remove the product if quantity would go to 0
        newCart.splice(index, 1);
      }

      localStorage.setItem("cart", JSON.stringify(newCart)); 
      return newCart;
    });
  };

  return (
    <div>
      <div className="cartList">
        {cart.map((item, index) => (
          <div key={index}>
            <span className="product-images">img</span>
            <br />
            {item.name}
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
              <button onClick={() => handleQuantity(index, "minus")}>-</button>
              <span className="quantity">{item.quantity}</span>
              <button onClick={() => handleQuantity(index, "add")}>+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cart;
