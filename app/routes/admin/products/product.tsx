import { use, useState } from "react";
import { useNavigate } from "react-router";

function Product() {
  const [quantity, setQuantities] = useState<number[]>([1, 1, 1]); 
  const [productName, setProductName] = useState<string[]>([]);
  const [product, setProduct] = useState("");

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
      name: productName[index],
      quantity: quantity[index],
    };

    // Get current cart from localStorage (or empty array if none)
    const cart: { name: string; quantity: number }[] = JSON.parse(localStorage.getItem("cart") || "[]");

    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(item => item.name === product.name);

    if (existingProductIndex !== -1) {
      // If exists, update quantity
      cart[existingProductIndex].quantity += product.quantity;
    } else {
      // If not, add new product
      cart.push(product);
    }

    // Save back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    alert(`Added ${product.quantity} ${product.name}(s) to cart`);
  };



  const handleBuyNow = (index: number) => {
    const product = {
      name: productName[index], 
      quantity: quantity[index],
    };    

    alert(`Proceeding to buy ${product.name} ${product.quantity} item(s)`);
  }

const handleAddProduct = () => {
  if (!product.trim()) return; // ignore empty input

  // add the new product to the list
  setProductName((prev) => [...prev, product]);

  // clear the input
  setProduct("");
};



  return (
    <div>

      <div className="addProduct">
        <label>Product name:</label>
        <input
          type="text"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
        />
      </div>

      <button onClick={handleAddProduct}>Add Product</button>

      <div className="productList">

      <ul className="productList">
        {productName.map((name, index) => (
          <li key={index}>
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
              <span className="product-images">img</span>
              <p>{name}</p>

              <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                <button className="add" onClick={() => handleQuantity(index, "minus")}>
                  -
                </button>
                <span className="quantity">{quantity[index]}</span>
                <button className="minus" onClick={() => handleQuantity(index, "add")}>
                  +
                </button>
              </div>

              <br />

              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <button onClick={() => handleAddCart(index)}>Add to cart</button>
                <button onClick={() => handleBuyNow(index)}>Buy now</button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      </div>
    </div>
  );
}

export default Product;
