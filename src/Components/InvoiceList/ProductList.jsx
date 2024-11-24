import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import db from "../../firebase/config";
import "./List.css";

const ProductList = ({ onSelectProduct }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const fetchedProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="list-container">
      <h2>Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <button onClick={() => onSelectProduct(product.id)}>
              {product.name || `Product ${product.id}`}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
