import { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Add product
  const [newProduct, setNewProduct] = useState({
    name: "",
    status: "IN_PROGRESS",
    description: "",
    launchDate: "",
  });

  // Update product (using modal)
  const [editingProduct, setEditingProduct] = useState(null);

  // Assign employee
  const [assignData, setAssignData] = useState({
    productId: "",
    employeeId: "",
  });

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:8081/api/products/getAllProduct"
      );
      const data = await res.json();
      setProducts(data.data.content || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // Handle add product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:8081/api/products/addProduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      setNewProduct({
        name: "",
        status: "IN_PROGRESS",
        description: "",
        launchDate: "",
      });
      fetchProducts();
      showMessage("Product added successfully!");
    } catch (err) {
      console.error("Error adding product:", err);
      showMessage("Error adding product", "error");
    }
  };

  // Handle delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await fetch(`http://localhost:8081/api/products/deleteProduct/${id}`, {
        method: "DELETE",
      });
      fetchProducts();
      showMessage("Product deleted successfully!");
    } catch (err) {
      console.error("Error deleting product:", err);
      showMessage("Error deleting product", "error");
    }
  };

  // Handle update product
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await fetch(
        `http://localhost:8081/api/products/updateProduct/${editingProduct.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingProduct),
        }
      );
      setEditingProduct(null);
      fetchProducts();
      showMessage("Product updated successfully!");
    } catch (err) {
      console.error("Error updating product:", err);
      showMessage("Error updating product", "error");
    }
  };

  // Handle assign employee
  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      await fetch(
        `http://localhost:8081/api/products/${assignData.productId}/assign-employee/${assignData.employeeId}`,
        { method: "POST" }
      );
      setAssignData({ productId: "", employeeId: "" });
      showMessage("Employee assigned successfully!");
    } catch (err) {
      console.error("Error assigning employee:", err);
      showMessage("Error assigning employee", "error");
    }
  };

  const formatDate = (date) => {
    if (Array.isArray(date)) {
      return `${date[0]}-${String(date[1]).padStart(2, "0")}-${String(
        date[2]
      ).padStart(2, "0")}`;
    }
    return date;
  };

  return (
    <div className="p-6 space-y-10 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-indigo-700 drop-shadow-md">
        🚀 Products Management
      </h1>

      {message && (
        <div
          className={`mx-auto max-w-lg text-center py-3 rounded-lg shadow-md font-medium transition ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Add Product */}
      <div className="bg-white shadow-xl rounded-2xl p-6 max-w-2xl mx-auto border border-indigo-100">
        <h2 className="text-xl font-semibold mb-4 text-indigo-700">
          ➕ Add New Product
        </h2>
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Product Name
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Description
            </label>
            <textarea
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600">
                Status
              </label>
              <select
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                value={newProduct.status}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, status: e.target.value })
                }
              >
                <option value="IN_PROGRESS">In Progress</option>
                <option value="Launched">Launched</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600">
                Launch Date
              </label>
              <input
                type="date"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                value={newProduct.launchDate}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, launchDate: e.target.value })
                }
              />
            </div>
          </div>
          <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg shadow hover:scale-[1.02] transition">
            Add Product
          </button>
        </form>
      </div>

      {/* Assign Employee */}
      <div className="bg-white shadow-xl rounded-2xl p-6 max-w-2xl mx-auto border border-purple-100">
        <h2 className="text-xl font-semibold mb-4 text-purple-700">
          👤 Assign Employee
        </h2>
        <form onSubmit={handleAssign} className="space-y-4">
          <select
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-400"
            value={assignData.productId}
            onChange={(e) =>
              setAssignData({ ...assignData, productId: e.target.value })
            }
            required
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Employee ID"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-400"
            value={assignData.employeeId}
            onChange={(e) =>
              setAssignData({ ...assignData, employeeId: e.target.value })
            }
            required
          />
          <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-lg shadow hover:scale-[1.02] transition">
            Assign Employee
          </button>
        </form>
      </div>

      {/* Product List */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          📦 All Products
        </h2>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 border border-gray-100 transition transform hover:-translate-y-1"
              >
                <h3 className="text-lg font-bold text-indigo-600 mb-2">
                  {p.name}
                </h3>
                <p className="text-gray-600 mb-2 line-clamp-3">
                  {p.description || "No description"}
                </p>
                <span
                  className={`inline-block px-3 py-1 text-sm rounded-full font-medium mb-2 ${
                    p.status === "IN_PROGRESS"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {p.status}
                </span>
                <p className="text-sm text-gray-500">
                  Launch Date: {formatDate(p.launchDate)}
                </p>
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() =>
                      setEditingProduct({
                        ...p,
                        launchDate: formatDate(p.launchDate),
                      })
                    }
                    className="flex-1 bg-yellow-500 text-white py-1 rounded-lg hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="flex-1 bg-red-500 text-white py-1 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Update Modal */}
      {editingProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">
              ✏️ Update Product
            </h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, name: e.target.value })
                }
                required
              />
              <textarea
                className="w-full p-2 border rounded-lg"
                value={editingProduct.description}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    description: e.target.value,
                  })
                }
              />
              <select
                className="w-full p-2 border rounded-lg"
                value={editingProduct.status}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    status: e.target.value,
                  })
                }
              >
                <option value="IN_PROGRESS">In Progress</option>
                <option value="Launched">Launched</option>
              </select>
              <input
                type="date"
                className="w-full p-2 border rounded-lg"
                value={editingProduct.launchDate}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    launchDate: e.target.value,
                  })
                }
              />
              <div className="flex space-x-4 mt-4">
                <button className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
                  Update
                </button>
                <button
                  type="button"
                  className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
