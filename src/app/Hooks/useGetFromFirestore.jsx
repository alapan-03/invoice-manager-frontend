import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./../../firebaseConfig"; // Ensure your Firebase config is imported

const useGetFromFirestore = (userEmail) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      setError("User email is required");
      return;
    }

    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const invoicesRef = collection(db, "Invoices");
        const q = query(invoicesRef, userEmail);
        const querySnapshot = await getDocs(q);
        
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Include the document ID for reference
          ...doc.data(),
        }));

        setInvoices(data);
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [userEmail]);

  return { invoices, loading, error };
};

export default useGetFromFirestore;
