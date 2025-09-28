export const handleAddProduct = (
  name: string,
  stock: number,
  category: string,
  setProducts: React.Dispatch<React.SetStateAction<any[]>>,
  setQuantity: React.Dispatch<React.SetStateAction<number[]>>,
  setProductName: React.Dispatch<React.SetStateAction<string>>,
  setStock: React.Dispatch<React.SetStateAction<number | "">>,
  setProductCategory: React.Dispatch<React.SetStateAction<string>>
) => {
  if (!name.trim()) return;

  const selectedProduct = {
    name,
    stock: Number(stock),
    category,
  };

  const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");

  const exists = storedProducts.some(
    (p: any) => p.name === selectedProduct.name
  );

  if (!exists) {
    storedProducts.push(selectedProduct);
    localStorage.setItem("products", JSON.stringify(storedProducts));
    setProducts(storedProducts);
    setQuantity((prev) => [...prev, 1]);
  }

  setProductName("");
  setStock("");
  setProductCategory("");
};
