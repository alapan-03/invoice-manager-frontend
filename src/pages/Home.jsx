import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { collection, writeBatch, doc } from "firebase/firestore";
import { db } from "./../firebaseConfig.js";
import { useDispatch, useSelector } from "react-redux";
import {
  setInvoices,
  updateInvoice,
  updateProduct,
  updateCustomer,
  updateCommonField,
} from "../features/invoices/invoicesSlice.jsx";
import FileUploader from "./../Components/Home/FileUploader/FileUploader.jsx";
import EditableTable from "./../Components/Home/Tables/EditableTable.jsx";
import TabLayout from "./../Components/Home/Tables/TabLayout.jsx";
// import { collection, setDoc, doc } from "firebase/firestore";
// import { collection, writeBatch, doc, setDoc } from "firebase/firestore";
import "./../Components/Home/Tables/Table2.css";
import Popup from "../Components/Home/ProductPopup/Popup.js";

import { AuthProvider, useAuth } from "./../AuthProvider.jsx";
import Navbar from "../Components/Navbar/Navbar.jsx";
import useSaveToFirestore from "../app/Hooks/useSaveToFirestore.jsx";
import useCleanResponse from "../app/Hooks/useCleanResponse.jsx";
import DetailsPopup from "../Components/Home/Tables/DetailsPopup/DetailsPopup.jsx";
import { saveAs } from "file-saver";
import Papa from "papaparse";

const Home = (props) => {
  const { user } = useAuth();

  console.log("UserHome: ", user?.email);

  const uid = uuidv4();
  const dispatch = useDispatch();
  const { invoices, products, customers } = useSelector(
    (state) => state.invoices
  );
  console.log("Id:", props.userId);

  // const [commonData, setCommonData] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [isDataReady, setIsDataReady] = useState(false);
  const [productsSt, setProductsSt] = useState();
  const [invoicesSt, setInvoicesSt] = useState();
  const [customersSt, setCustomersSt] = useState();
  const [serialSt, setSerialSt] = useState([]);
  const [showPopupSt, setShowPopupSt] = useState();
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [details, setDetails] = useState(null);

  const { saveAllToFirestore, loading, error } = useSaveToFirestore();
  // const { cleanResponse } = useCleanResponse();

  const flattenProducts = (products) => {
    if (!products || !Array.isArray(products)) return "";
    return products
      .map(
        (product) =>
          `Name: ${
            product["ProductName"] ||
            product["Name"] ||
            product["productName"] ||
            product["InvoiceItems"]
          }, Qty: ${
            product["Qty"] || product["qty"] || product["Quantity"] || 0
          }, Total: ${
            Array.isArray(product["TotalAmount"])
              ? product["TotalAmount"].reduce((sum, value) => sum + value, 0)
              : product["TotalAmount"] || 0
          },
          
          `
      )
      .join(" | "); // Use `|` or another delimiter to separate multiple products
  };

  // const prepareDataForCSV = (data) => {
  //   return data.map((item) => ({
  //     ...item,
  //     Products: flattenProducts(item.Products), // Flatten or stringify the Products array
  //   }));
  // };


  const prepareDataForCSV = (data) => {
    const flattenedData = [];
    data.forEach((invoice) => {
      const products = invoice.Products || [];
      products.forEach((product) => {
        flattenedData.push({
          InvoiceID: invoice.SerialNumber || invoice.InvoiceID,
          CustomerName: invoice.CustomerName,
          PhoneNumber: invoice.PhoneNumber,
          InvoiceDate: invoice.InvoiceDate,
          ProductName: product["ProductName"] ||
          product["Name"] ||
          product["productName"] ||
          product["InvoiceItems"] || "Unknown",
          Qty: product["Qty"] || product["qty"] || product["Quantity"] || 0,
          TotalAmount: product["TotalAmount"]
          ? product["TotalAmount"].reduce((sum, value) => sum + value, 0)
          : product["TotalAmount"] || 0,
        });
      });
    });
    return flattenedData;
  };
  

  // Add this function to export CSV
  const exportAsCSV = (data, filename = "data.csv") => {
    const preparedData = prepareDataForCSV(data);
    const csv = Papa.unparse(preparedData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, filename);
  };

  function cleanResponse(responseText) {
    try {
      // Remove backticks and the word "json"
      const cleanedResponse = responseText
        .replace(/`/g, "") // Remove all backticks
        .replace(/json/gi, "") // Remove occurrences of "json" (case-insensitive)
        .trim(); // Remove leading/trailing whitespace

      // Parse the cleaned response into JSON
      const parsedData = JSON.parse(cleanedResponse);

      return parsedData; // Return the JSON object
    } catch (error) {
      console.error("Error parsing cleaned response:", error.message);
      throw new Error("Failed to clean and parse response into JSON.");
    }
  }

  const handleShowPopup = (bool) => {
    console.log(bool);
    // setShowPopupSt(bool)

    let selPopup = invoicesSt?.flatMap((el) =>
      (el?.ProductDetails ? el.ProductDetails : el.productDetails).filter(
        (item) => item.productSerialNo === bool
      )
    );
    setShowPopupSt(JSON.stringify(selPopup));
    console.log(JSON.stringify(selPopup) + "sfd");
  };

  async function handleSave() {
    const docId = await saveAllToFirestore("Invoices", invoicesSt);
    if (docId) {
      alert(`Data saved successfully with ID: ${docId}`);
    } else {
      alert("Error");
    }
  }

  const handleDetails = async (invDetails) => {
    console.log("invdetails: ", invDetails.name);
    setDetails({ name: invDetails.name, description: invDetails.description });
  };

  function handleShowDetailsPopup(e) {
    console.log("e:", e);
    setShowDetailsPopup(e);
  }

  const handleUpdateProduct = (updatedProduct) => {
    const updatedInvoices = invoicesSt.map((invoice) => ({
      ...invoice,
      ProductDetails: (invoice?.ProductDetails
        ? invoice.ProductDetails
        : invoice.productDetails
      ).map((product) =>
        product.productSerialNo === updatedProduct.productSerialNo
          ? updatedProduct
          : product
      ),
    }));
    setInvoicesSt(updatedInvoices);
    setShowPopupSt(null); // Close popup after update
  };

  console.log("Customer reducer:", customers);

  const updateInvoices = (index, updatedInvoice) => {
    console.log(updatedInvoice, "hellp");
    const updatedInvoices = [...invoicesSt];
    updatedInvoices[index] = { ...updatedInvoices[index], ...updatedInvoice };
    setInvoicesSt(updatedInvoices);

    dispatch(setInvoices({ invoices: updatedInvoices }));
    console.log(updatedInvoices);
    // console.log(setInvoicesSt, "wdfd")
  };
  console.log("Invoices reducer:", invoices);

  const handleUpload = (data) => {
    let invoicesEx = cleanResponse(data.data).Invoices;
    const customersEx = cleanResponse(data.data).Customers.map((customer) => ({
      ...customer,
      CustomerID: customer.CustomerID || uuidv4(), // Assign a UUID if not present
    }));
    let productsEx = cleanResponse(data.data).Products;
    // const customers = cleanRespons
    console.log("Extracted Invoices:", invoicesEx);
    console.log("Extracted Invoices:", productsEx);
    console.log("Extracted Invoices:", customersEx);

    setInvoicesSt(invoicesEx);
    setCustomersSt(customersEx);
    // const products = extractSection(data?.data, "Products");
    setProductsSt(productsEx);
    dispatch(setInvoices({ invoicesEx, productsEx, customersEx }));

    const normalizedInvoices = invoices?.map((invoice) => ({
      ...invoice,
      productDetails: invoice.productDetails?.map((product) => {
        const matchingProduct = products?.find(
          (p) => p?.Name === product?.ProductName
        );
        return {
          ...product,
          ...matchingProduct, // Merge matching product details from the standalone section
        };
      }),
    }));

    // console.log("Normalized Invoices:", normalizedInvoices);
    // console.log("Extracted Products:", products);

    // Dispatch normalized and extracted data
    dispatch(
      setInvoices({ invoices: normalizedInvoices, products, customers })
    );
  };

  console.log("InvoiceSt: ", invoicesSt);
  console.log("Invoicea: ", invoices);
  // console.log("ProductSt: ",productsSt);

  useEffect(() => {
    // Process invoices and update serialSt
    const processedSerials = processedInvoices?.map(
      (invoice) => invoice["SerialNumber"]
    );
    console.log("Serials: processed: ", processedSerials);
    setSerialSt(processedSerials || "na");
  }, [invoices]);

  const processedInvoices = invoicesSt?.map((invoice) => {
    // Process products
    console.log("Invoices: ", invoicesSt);
    const products = invoice?.productDetails
      ? invoice.productDetails
      : invoice.InvoiceItems
      ? invoice.InvoiceItems
      : invoice.ProductName
      ? invoice.ProductName
      : invoice?.ProductDetails
      ? invoice.ProductDetails
      : invoice?.Products
      ? invoice.peoducts
      : invoice?.products?.map((product, index) => ({
          SerialNumber: invoice["SerialNumber"],
          UUID: uuidv4(),
          ProductName:
            product["ProductName"] ||
            product["Name"] ||
            product["productName"] ||
            product["InvoiceItems"],
          Qty: product["Qty"] || product["qty"] || product["Quantity"] || 0,
          Tax: (product["Tax"] !== undefined
            ? product["Tax"]
            : product["tax"] || 0
          ).reduce((acc, curr) => acc + curr, 0),
          TotalAmount: product["TotalAmount"] || product["totalAmount"] || 0,
          UUID: uuidv4(),
        })) || [];

    return {
      SerialNumber: invoice["SerialNumber"],
      CustomerName: invoice["CustomerName"] || invoice["customerName"],
      PhoneNumber: invoice["PhoneNumber"],
      InvoiceDate: invoice["InvoiceDate"] || "Unknown",
      Subtotal: invoice["Subtotal"] || 0,
      Tax: Array.isArray(invoice["Tax"])
        ? invoice["Tax"].reduce((sum, value) => sum + value, 0)
        : invoice["Tax"] || 0,
      TotalAmount: Array.isArray(invoice["TotalAmount"])
        ? invoice["TotalAmount"].reduce((sum, value) => sum + value, 0)
        : invoice["TotalAmount"] || 0,
      BillingAddress: invoice["Address"] || "N/A",
      Products: products,
    };
  });

  console.log("Processed: ", processedInvoices);

  const tabs = [
    {
      label: "Invoices",
      content: (
        <EditableTable
          data={processedInvoices}
          // onUpdate={(index, updatedRow) =>
          //   handleUpdate("invoices", index, updatedRow)
          // }
          showPopup={(e) => handleShowPopup(e)}
          onUpdate={(index, updatedRow) => {
            updateInvoices(index, updatedRow);
            // updateCustomers(index, updatedRow);
            // handleUpdate("invoices", index, updatedRow);
          }}
          tab="Invoices"
        />
      ),
    },
  ];
  console.log(showDetailsPopup);

  return (
    <div>
      {showDetailsPopup && (
        <DetailsPopup
          details={handleDetails}
          showPopup={handleShowDetailsPopup}
          invoicesSt={invoicesSt}
        />
      )}
      {showPopupSt && (
        <Popup
          products={showPopupSt}
          onUpdate={handleUpdateProduct}
          onClose={() => setShowPopupSt(null)}
        />
      )}

      <FileUploader onUpload={handleUpload} userId={props.userId} />
      <TabLayout
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {invoicesSt && (
        <div className="save-btn-cont">
          {/* <button
            onClick={() => handleShowDetailsPopup(true)}
            className="save-btn"
          >
            Save
          </button> */}

          <button
            onClick={() => exportAsCSV(processedInvoices, "invoices.csv")}
            className="save-btn"
          >
            Export as CSV
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
