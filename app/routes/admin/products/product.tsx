import { useState } from "react";
import { useNavigate } from "react-router";

function Product() {
  const [quantity, setQuantity] = useState(1);
  const [productName, setProductName] = useState("Saging sa cebu");

  const handleQuantity = (type: "add" | "minus") => {
    if (type === "add") {
      setQuantity(quantity + 1);
    } else if (type === "minus" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddCart = () => {
    alert(`Added ${productName} ${quantity} item(s) to cart`);
  }

  const handleBuyNow = () => {
    alert(`Proceeding to buy ${productName} ${quantity} item(s)`);
  }


  return (
    <main>
      <div className="product-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "2rem" }}>
        <span className="product-images">
          img
        </span>
        <p>{productName}</p>
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
          <button className="add" onClick={() => handleQuantity("minus")}>-</button>
            <span className="quantity">{quantity}</span>
          <button className="minus" onClick={() => handleQuantity("add")}>+</button>
        </div>
        <br />
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button onClick={handleAddCart}>Add to cart </button>
          <button onClick={handleBuyNow}>Buy now</button>
        </div>
      </div>
    </main>
  );
}

export default Product;
