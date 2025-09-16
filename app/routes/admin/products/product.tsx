import { use, useState, useEffect } from "react";
import { useNavigate } from "react-router";

function Product() {

  const [products, setProducts] = useState<{ name: string; stock: number }[]>([]);
  const [quantity, setQuantity] = useState<number[]>([]);
  const [productName, setProduct] = useState("");
  const [stock, setStock] = useState<number | "">("");

  

  // Load products from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("products") || "[]");
    setProducts(stored);
    setQuantity(stored.map(() => 1)); // init each product with qty = 1
  }, []);

  const handleQuantity = (index: number, type: "add" | "minus") => {
    setQuantity((prev) => {
      const newQuantity = [...prev];
      if (type === "add") {
        newQuantity[index] += 1;

        if (newQuantity[index] > products[index].stock) {
          newQuantity[index] = products[index].stock; // cap at stock
        }

      } else if (type === "minus" && newQuantity[index] > 1) {
        newQuantity[index] -= 1;
      }
      return newQuantity;
    });
  };


  const handleAddCart = (index: number) => {
    const selectedProduct = {
      name: products[index].name,
      quantity: quantity[index],
    };

    // Get current cart from localStorage (or empty array if none)
    const cart: { name: string; quantity: number }[] = JSON.parse(localStorage.getItem("cart") || "[]");

    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(item => item.name === selectedProduct.name);

    if (existingProductIndex !== -1) {
      // If exists, update quantity
      cart[existingProductIndex].quantity += selectedProduct.quantity;
    } else {
      // If not, add new product
      cart.push(selectedProduct);
    }

    // Save back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    alert(`Added ${selectedProduct.quantity} ${selectedProduct.name}(s) to cart`);
  };



  const handleBuyNow = (index: number) => {
    const selectedProduct = {
      name: products[index].name, 
      quantity: quantity[index],
    };    

    alert(`Proceeding to buy ${selectedProduct.name} ${selectedProduct.quantity} item(s)`);
  }

const handleAddProduct = (name: string, stock: number) => {
  if (!name.trim()) return;

  const selectedProduct = { name, stock: Number(stock) };

  // Get existing products from localStorage
  const storedProducts: { name: string; stock: number }[] = JSON.parse(
    localStorage.getItem("products") || "[]"
  );

  // Check if it already exists (by name only)
  const exists = storedProducts.some((p) => p.name === selectedProduct.name);

  if (!exists) {
    storedProducts.push(selectedProduct);

    // Save back to localStorage
    localStorage.setItem("products", JSON.stringify(storedProducts));

    // Update React state
    setProducts(storedProducts);
    setQuantity((prev) => [...prev, 1]); // start at quantity 1
  }

  // Reset inputs
  setProduct("");
  setStock("");
};





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
              setStock(val === "" ? "" : Number(val)); // allow empty or number
            }}
          />
      </div>

      <button onClick={() => handleAddProduct(productName, Number(stock))}>Add Product</button>

      <div className="productList">
        <ul className="productList">
          {products.map((prod, index) => (
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
                <span className="productImage">img</span>
                <p>{prod.name}</p>

                <span className="productStock">Stock: {prod.stock}</span>

                <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                  <button className="add" onClick={() => handleQuantity(index, "minus")}>
                    -
                  </button>
                  <span className="quantity">{quantity[index]}</span>
                  <button className="minus" onClick={() => handleQuantity(index, "add")}>
                    +
                  </button>
                </div>

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
