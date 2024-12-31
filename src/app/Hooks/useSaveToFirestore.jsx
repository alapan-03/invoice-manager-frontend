// import { collection, writeBatch, doc } from "firebase/firestore";
// import { db } from "./../../firebaseConfig";
// import { useState, useEffect } from "react";
// import { AuthProvider, useAuth } from './../../AuthProvider';

// const useSaveToFirestore = (collectionName, invoicesSt) => {

//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//       const { user } = useAuth();

//   const saveAllToFirestore = async (collectionName, invoicesSt) => {
//     try {
//       if (!invoicesSt || invoicesSt.length === 0) {
//         console.error("No invoices to save.");
//         return;
//       }

//       setLoading(true);
//       setError(null);

//       const batch = writeBatch(db); // Initialize Firestore batch

//       invoicesSt.forEach((invoice) => {
//         const processedInvoice = {
//           ...invoice,
//           SerialNo: invoice.SerialNumber || "N/A",
//           CustomerName: invoice.CustomerName || "Unknown Customer",
//           BillingAddress: invoice.BillingAddress || "N/A",
//           PhoneNumber: invoice.PhoneNumber || "N/A",
//           Subtotal: isNaN(Number(invoice.Subtotal))
//             ? 0
//             : Number(invoice.Subtotal),
//           Tax: isNaN(Number(invoice.Tax)) ? 0 : Number(invoice.Tax),
//           TotalAmount: isNaN(Number(invoice.TotalAmount))
//             ? 0
//             : Number(invoice.TotalAmount),
//           PaymentInformation: invoice.PaymentInformation || {
//             Bank: "N/A",
//             AccountName: "N/A",
//             AccountNumber: "N/A",
//           },
//           ProductDetails: invoice.ProductDetails || [],
//           Products: invoice.Products || [],
//           Date: invoice.Date || "Unknown",
//           DueDate: invoice.DueDate || "N/A",
//           InvoiceDate: invoice.InvoiceDate || "Unknown",
//         };

//         const docRef = doc(collection(db, "Invoices"), invoicesSt);
//         batch.set(docRef, processedInvoice);
//       });

//       await batch.commit();
//       setLoading(false);
//       console.log("Invoices successfully saved to Firestore.");
//     } catch (err) {
//         setLoading(false);
//         setError(err.message);
//       console.error("Error saving invoices to Firestore:", err.message);
//     }
//   };

//  return { saveAllToFirestore, loading, error };
// };

// export default useSaveToFirestore;

import { collection, writeBatch, doc, setDoc } from "firebase/firestore";
import { db } from "./../../firebaseConfig";
import { useState } from "react";
import { useAuth } from "./../../AuthProvider";
import { v4 as uuidv4 } from "uuid";

const useSaveToFirestore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  console.log(db);

  // const saveAllToFirestore = async (collectionName, invoicesSt, name, description) => {
  //   try {
  //     if (!invoicesSt || invoicesSt.length === 0) {
  //       console.error("No invoices to save.");
  //       return;
  //     }

  //     console.log("Step1", db);

  //     setLoading(true);
  //     setError(null);

  //     console.log("Hello"); // Initialize Firestore batch
  //     const batch = writeBatch(db);
  //     console.log("Hello", batch); // Initialize Firestore batch

  //     console.log("Step1");
  //     invoicesSt.forEach((invoice) => {
  //       const processedInvoice = {
  //         ...invoice,
  //         name, description,
  //         date: Date.now(),
  //         SerialNo: invoice.SerialNumber || "N/A",
  //         CustomerName: invoice.CustomerName || "Unknown Customer",
  //         BillingAddress: invoice.BillingAddress || "N/A",
  //         PhoneNumber: invoice.PhoneNumber || "N/A",
  //         Subtotal: isNaN(Number(invoice.Subtotal))
  //           ? 0
  //           : Number(invoice.Subtotal),
  //         Tax: isNaN(Number(invoice.Tax)) ? 0 : Number(invoice.Tax),
  //         TotalAmount: isNaN(Number(invoice.TotalAmount))
  //           ? 0
  //           : Number(invoice.TotalAmount),
  //         PaymentInformation: invoice.PaymentInformation || {
  //           Bank: "N/A",
  //           AccountName: "N/A",
  //           AccountNumber: "N/A",
  //         },
  //         ProductDetails: invoice.ProductDetails || [],
  //         Products: invoice.Products || [],
  //         Date: invoice.Date || "Unknown",
  //         DueDate: invoice.DueDate || "N/A",
  //         InvoiceDate: invoice.InvoiceDate || "Unknown",
  //       };

  //       // Use a unique document ID
  //       const docRef = doc(collection(db, user?.email), name);
  //       batch.set(docRef, processedInvoice);
  //     });

  //     await batch.commit();
  //     setLoading(false);
  //     console.log("Invoices successfully saved to Firestore.");
  //   } catch (err) {
  //     setLoading(false);
  //     setError(err.message);
  //     console.error("Error saving invoices to Firestore:", err.message);
  //   }
  // };

  const saveAllToFirestoreEdit = async (collectionName, invoicesSt, name, description, id) => {
    try {
      console.log("Collection name: ", collectionName, name)
      if (!collectionName || !name) {
        throw new Error("Collection name and document name must be provided.");
      } 
      
      if (!invoicesSt || invoicesSt.length === 0) {
        console.error("No invoices to save.");
        return;
      }
  
      console.log("Starting save process...");
      setLoading(true);
      setError(null);
  
      // Reference to the document
      const docRef = doc(collection(db, collectionName), name);
  
      // Structure data to save
      const dataToSave = {
        description,
        date: Date.now(),
        id,
        name,
        description,
        invoices: invoicesSt, // Save the whole array
      };

      console.log(dataToSave)
  
      // Save data
      await setDoc(docRef, dataToSave);
  
      setLoading(false);
      console.log("Invoices successfully saved to Firestore.");
      return docRef.id; // Return document ID for success
    } catch (err) {
      setLoading(false);
      setError(err.message);
      console.error("Error saving invoices to Firestore:", err.message);
      return null; // Indicate failure
    }
  };
  


  const saveAllToFirestore = async (collectionName, invoicesSt, name, description) => {
    try {
      console.log("Collection name: ", collectionName, name)
      if (!collectionName || !name) {
        throw new Error("Collection name and document name must be provided.");
      } 
      
      if (!invoicesSt || invoicesSt.length === 0) {
        console.error("No invoices to save.");
        return;
      }
  
      console.log("Starting save process...");
      setLoading(true);
      setError(null);
  
      // Reference to the document
      const docRef = doc(collection(db, collectionName), name);
  
      // Structure data to save
      const dataToSave = {
        description,
        date: Date.now(),
        id: uuidv4(),
        name,
        description,
        invoices: invoicesSt, // Save the whole array
      };

      console.log(dataToSave)
  
      // Save data
      await setDoc(docRef, dataToSave);
  
      setLoading(false);
      console.log("Invoices successfully saved to Firestore.");
      return docRef.id; // Return document ID for success
    } catch (err) {
      setLoading(false);
      setError(err.message);
      console.error("Error saving invoices to Firestore:", err.message);
      return null; // Indicate failure
    }
  };
  
  return { saveAllToFirestore, saveAllToFirestoreEdit,loading, error };
};

export default useSaveToFirestore;
