import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import db from "../../firebase/config";
import "./List.css";

const CustomerList = ({ onSelectProduct }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "customers"));
        const fetchedProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCustomers(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return <div>Loading customer...</div>;
  }

  return (
    <div className="list-container">
      <h2>Products</h2>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>
            <button onClick={() => onSelectProduct(customer.id)}>
              {customer.name || `Product ${customer.id}`}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerList;
