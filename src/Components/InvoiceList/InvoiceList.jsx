import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
// import db from "../../firebase/config";
import "./List.css"

// const InvoiceList = ({ onSelectInvoice }) => {
//   const [invoices, setInvoices] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchInvoices = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, "invoices"));
//         const fetchedInvoices = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setInvoices(fetchedInvoices);
//       } catch (error) {
//         console.error("Error fetching invoices:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInvoices();
//   }, []);

//   if (loading) {
//     return <div>Loading invoices...</div>;
//   }

//   return (
//     <div className="invoice-list">
//     {/* <h2>Invoices</h2> */}
//     <div className="cards-container">
//       {invoices.map((invoice) => (
//         <div key={invoice.id} className="card" onClick={() => onSelectInvoice(invoice.id)}>
//           <div className="card-header">
//             {invoice.id.slice(0, 6).toUpperCase()}
//           </div>
//           <div className="card-body">
//             <p><strong>Serial Number:</strong> {invoice.CustomerName || "N/A"}</p>
//             <p><strong>Date:</strong> {invoice.InvoiceDate || "N/A"}</p>
//             <p><strong>Amount:</strong> {invoice.TotalAmount || "N/A"}</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
//   );
// };

// export default InvoiceList;
