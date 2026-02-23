const BASE_URL = "http://localhost:5000";

// Helper to get userId (adjust based on your auth setup)
const getUserId = (): string => {
  return localStorage.getItem("userId") || "guest";
};

// ─── PRODUCT HANDLERS ────────────────────────────────────────────────────────

export const handleFetchProducts = async (
  setProducts: React.Dispatch<React.SetStateAction<any[]>>,
  setQuantity: React.Dispatch<React.SetStateAction<number[]>>,
) => {
  try {
    const res = await fetch(`${BASE_URL}/products`);
    const data = await res.json();
    setProducts(data);
    setQuantity(data.map(() => 1));
  } catch (err) {
    console.error("Failed to fetch products:", err);
  }
};

export const handleAddProduct = async (
  name: string,
  stock: number,
  category: string,
  price: number,
  setProducts: React.Dispatch<React.SetStateAction<any[]>>,
  setQuantity: React.Dispatch<React.SetStateAction<number[]>>,
  setProductName: React.Dispatch<React.SetStateAction<string>>,
  setStock: React.Dispatch<React.SetStateAction<number | "">>,
  setProductCategory: React.Dispatch<React.SetStateAction<string>>,
  setPrice: React.Dispatch<React.SetStateAction<number | "">>,
) => {
  if (!name.trim()) return;

  try {
    const res = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        price: Number(price),
        stock: Number(stock),
        category,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.message || "Failed to add product.");
      return;
    }

    // Refetch all products to keep state in sync
    const allRes = await fetch(`${BASE_URL}/products`);
    const allData = await allRes.json();
    setProducts(allData);
    setQuantity(allData.map(() => 1));

    setProductName("");
    setStock("");
    setProductCategory("");
    setPrice("");
  } catch (err) {
    console.error("Failed to add product:", err);
  }
};

export const handleAddCart = async (
  index: number,
  products: { id: number; name: string; category: string }[],
  quantity: number[],
) => {
  const userId = getUserId();
  const selectedProduct = products[index];

  try {
    const res = await fetch(`${BASE_URL}/cart/${userId}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: selectedProduct.id,
        quantity: quantity[index],
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.message || "Failed to add to cart.");
      return;
    }

    alert(`Added ${quantity[index]} × ${selectedProduct.name} to cart`);
  } catch (err) {
    console.error("Failed to add to cart:", err);
  }
};

export const handleBuyNow = async (
  index: number,
  products: { id: number; name: string; stock: number; category: string }[],
  quantity: number[],
  setProducts: React.Dispatch<React.SetStateAction<any[]>>,
) => {
  const selectedProduct = products[index];
  const qty = quantity[index];

  if (qty > selectedProduct.stock) {
    alert(`Not enough stock for ${selectedProduct.name}`);
    return;
  }

  try {
    const userId = getUserId();
    const res = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        productId: selectedProduct.id,
        quantity: qty,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.message || "Failed to place order.");
      return;
    }

    const data = await res.json();

    // Sync updated product stock from response
    setProducts((prev) =>
      prev.map((p) => (p.id === selectedProduct.id ? data.updatedProduct : p)),
    );

    alert(`Ordered ${qty} × ${selectedProduct.name}`);
  } catch (err) {
    console.error("Failed to buy now:", err);
  }
};

export const handleQuantity = (
  index: number,
  type: "add" | "minus",
  products: { name: string; stock: number; category: string }[],
  setQuantity: React.Dispatch<React.SetStateAction<number[]>>,
) => {
  setQuantity((prev) => {
    const newQuantity = [...prev];
    if (type === "add") {
      newQuantity[index] = Math.min(
        newQuantity[index] + 1,
        products[index].stock,
      );
    } else if (type === "minus" && newQuantity[index] > 1) {
      newQuantity[index] -= 1;
    }
    return newQuantity;
  });
};

export const toggleSelection = (
  name: string,
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>,
) => {
  setSelectedItems((prev) =>
    prev.includes(name)
      ? prev.filter((item) => item !== name)
      : [...prev, name],
  );
};

export const handleDeleteSelected = async (
  selectedItems: string[],
  products: { id: number; name: string; stock: number; category: string }[],
  setProducts: React.Dispatch<React.SetStateAction<any[]>>,
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>,
) => {
  if (selectedItems.length === 0) {
    alert("No products selected!");
    return;
  }

  try {
    const toDelete = products.filter((p) => selectedItems.includes(p.name));

    await Promise.all(
      toDelete.map((p) =>
        fetch(`${BASE_URL}/products/${p.id}`, { method: "DELETE" }),
      ),
    );

    const allRes = await fetch(`${BASE_URL}/products`);
    const allData = await allRes.json();
    setProducts(allData);
    setSelectedItems([]);
  } catch (err) {
    console.error("Failed to delete selected:", err);
  }
};

export const handleDeleteProduct = async (
  id: number,
  setProducts: React.Dispatch<React.SetStateAction<any[]>>,
  setQuantity: React.Dispatch<React.SetStateAction<number[]>>,
) => {
  try {
    const res = await fetch(`${BASE_URL}/products/${id}`, { method: "DELETE" });

    if (!res.ok) {
      const err = await res.json();
      alert(err.message || "Failed to delete product.");
      return;
    }

    const allRes = await fetch(`${BASE_URL}/products`);
    const allData = await allRes.json();
    setProducts(allData);
    setQuantity(allData.map(() => 1));
  } catch (err) {
    console.error("Failed to delete product:", err);
  }
};

export const handleEditProduct = (
  index: number,
  products: {
    id: number;
    name: string;
    stock: number;
    category: string;
    price: number;
  }[],
  setEditIndex: React.Dispatch<React.SetStateAction<number | null>>,
  setEditForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      stock: number;
      category: string;
      price: number;
    }>
  >,
) => {
  const product = products[index];
  setEditForm({
    name: product.name,
    stock: product.stock,
    category: product.category,
    price: product.price,
  });
  setEditIndex(index);
};

export const handleSaveEdit = async (
  editIndex: number | null,
  editForm: { name: string; stock: number; category: string; price: number },
  products: {
    id: number;
    name: string;
    stock: number;
    category: string;
    price: number;
  }[],
  setProducts: React.Dispatch<React.SetStateAction<any[]>>,
  setEditIndex: React.Dispatch<React.SetStateAction<number | null>>,
  setEditForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      stock: number;
      category: string;
      price: number;
    }>
  >,
) => {
  if (editIndex === null) return;

  const productId = products[editIndex].id;

  try {
    const res = await fetch(`${BASE_URL}/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editForm.name,
        stock: editForm.stock,
        price: editForm.price,
        category: editForm.category,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.message || "Failed to update product.");
      return;
    }

    const allRes = await fetch(`${BASE_URL}/products`);
    const allData = await allRes.json();
    setProducts(allData);
    setEditIndex(null);
    setEditForm({ name: "", stock: 0, category: "", price: 0 });
  } catch (err) {
    console.error("Failed to save edit:", err);
  }
};

export const handleCancelEdit = (
  setEditIndex: React.Dispatch<React.SetStateAction<number | null>>,
  setEditForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      stock: number;
      category: string;
      price: number;
    }>
  >,
) => {
  setEditIndex(null);
  setEditForm({ name: "", stock: 0, category: "", price: 0 });
};

export const handleSearchProduct = (
  searchTerm: string,
  products: {
    id: number;
    name: string;
    stock: number;
    price: number;
    category: string;
  }[],
  setFilteredProducts: React.Dispatch<
    React.SetStateAction<
      {
        id: number;
        name: string;
        stock: number;
        price: number;
        category: string;
      }[]
    >
  >,
) => {
  const lower = searchTerm.toLowerCase().trim();
  if (lower === "") {
    setFilteredProducts(products);
  } else {
    setFilteredProducts(
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.category.toLowerCase().includes(lower),
      ),
    );
  }
};
