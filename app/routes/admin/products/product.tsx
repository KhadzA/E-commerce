import { use, useState } from "react";
import { useNavigate } from "react-router";

function Product() {
  const [quantity, setQuantities] = useState<number[]>([1, 1, 1]); 
  const [productName, setProductName] = useState(["Saging sa cebu", "Kalabaw ng chavacano", "Tanso ng tagalog"]);
  const [product, setProduct] = useState();

  const handleQuantity = (index: number, type: "add" | "minus") => {
    setQuantities((prev) => {
      const newQuantity = [...prev];
      if (type === "add") {
        newQuantity[index] += 1;
      } else if (type === "minus" && newQuantity[index] > 1) {
        newQuantity[index] -= 1;
      }
      return newQuantity;
    });
  };


  const handleAddCart = (index: number) => {
    const product = {
      name: productName[index], // pick the product at that index
      quantity: quantity[index],       // still using the same quantity state for now
    };

    alert(`Added ${product.quantity} ${product.name}(s) to cart`);
  };


  const handleBuyNow = () => {
    alert(`Proceeding to buy ${productName} ${quantity} item(s)`);
  }


  return (
    <div>
      <div className="productList">

        <div className="product-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "2rem" }}>
          <span className="product-images">
            img
          </span>
          <p>{productName[0]}</p>
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            <button className="add" onClick={() => handleQuantity(0, "minus")}>-</button>
              <span className="quantity">{quantity[0]}</span>
            <button className="minus" onClick={() => handleQuantity(0, "add")}>+</button>
          </div>
          <br />
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button onClick={() => handleAddCart(0)}>Add to cart</button>
            <button onClick={handleBuyNow}>Buy now</button>
          </div>
        </div>

        <div className="product-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "2rem" }}>
          <span className="product-images">
            img
          </span>
          <p>{productName[1]}</p>
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            <button className="add" onClick={() => handleQuantity(1, "minus")}>-</button>
              <span className="quantity">{quantity[1]}</span>
            <button className="minus" onClick={() => handleQuantity(2, "add")}>+</button>
          </div>
          <br />
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button onClick={() => handleAddCart(1)}>Add to cart</button>
            <button onClick={handleBuyNow}>Buy now</button>
          </div>
        </div>

        <div className="product-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "2rem" }}>
          <span className="product-images">
            img
          </span>
          <p>{productName[2]}</p>
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            <button className="add" onClick={() => handleQuantity(2, "minus")}>-</button>
              <span className="quantity">{quantity[2]}</span>
            <button className="minus" onClick={() => handleQuantity(2, "add")}>+</button>
          </div>
          <br />
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button onClick={() => handleAddCart(2)}>Add to cart</button>
            <button onClick={handleBuyNow}>Buy now</button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Product;
