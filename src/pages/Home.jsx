import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

import { useDispatch, useSelector } from "react-redux";
import {
  setInvoices,
  updateInvoice,
  updateProduct,
  updateCustomer,
  updateCommonField,
} from "../features/invoices/invoicesSlice.jsx";
import FileUploader from "./../Components/FileUploader/FileUploader.jsx";
import EditableTable from "../Components/Tables/EditableTable.jsx";
import TabLayout from "../Components/Tables/TabLayout.jsx";
// import { collection, setDoc, doc } from "firebase/firestore";
import { collection, writeBatch, doc, setDoc } from "firebase/firestore";
import "./../Components/Tables/Tables.css"

const Home = () => {
  const dispatch = useDispatch();
  const { invoices, products, customers } = useSelector(
    (state) => state.invoices
  );

  // const [commonData, setCommonData] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [isDataReady, setIsDataReady] = useState(false);
  const [productsSt, setProductsSt] = useState();
  const [invoicesSt, setInvoicesSt] = useState();
  const [customersSt, setCustomersSt] = useState();
  const [serialSt, setSerialSt] = useState([]);


  // / // Create a regex to match the specified section
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
    

  const updateAllData = ({
    updatedInvoices,
    updatedProducts,
    updatedCustomers,
  }) => {
    // Ensure updatedProducts reflects in updatedInvoices
    if (updatedProducts) {
      updatedInvoices = updatedInvoices?.map((invoice) => ({
        ...invoice,
        productDetails: invoice?.productDetails?.map((product) => {
          const matchingProduct = updatedProducts?.find(
            (p) => p?.Name === product?.ProductName
          );
          return matchingProduct ? { ...product, ...matchingProduct } : product;
        }),
      }));
    }

    // Ensure updatedInvoices reflects in updatedProducts
    if (updatedInvoices) {
      updatedProducts = updatedProducts?.map((product) => {
        const isUsedInInvoices =
          updatedInvoices &&
          updatedInvoices?.some((invoice) =>
            invoice?.productDetails?.some((p) => p?.ProductName === product?.Name)
          );
        if (isUsedInInvoices) {
          const matchingDetails = updatedInvoices
            ?.flatMap((invoice) => invoice.productDetails)
            ?.find((p) => p?.ProductName === product?.Name);
          return matchingDetails ? { ...product, ...matchingDetails } : product;
        }
        return product;
      });
    }

    // Dispatch updates
    dispatch(
      setInvoices({
        invoices: updatedInvoices || invoices,
        products: updatedProducts || products,
        customers: updatedCustomers || customers,
      })
    );
  };

  // const updateInvoices = (index, updatedInvoice) => {
  //   const updatedInvoices = [...invoicesSt];
  //   updatedInvoices[index] = updatedInvoice;

  //   const updatedProducts = productsSt?.map((product) => {
  //     const matchingProduct = updatedInvoice?.productDetails?.find(
  //       (p) => p?.ProductName === (product?.Name || product?.ProductName)
  //     );
  //     return matchingProduct ? { ...product, ...matchingProduct } : product;
  //   });

  //   updateAllData({ updatedInvoices, updatedProducts });

    
  // };


  const updateCustomers = (index, updatedCustomer) => {
    // Update standalone customer list
    console.log("Updated Cus: ", updatedCustomer)
    const updatedCustomers = customers?.length>0 ? [...customers]: [...customersSt];
    updatedCustomers[index] = updatedCustomer;
 
    const updatedInvoices = invoicesSt?.map((invoice) =>
      invoice.SerialNumber === updatedCustomer.serials
        ? { ...invoice, ...updatedCustomer } // Update matching customer in the invoice
        : invoice
    );
  
    // Update local states
    setCustomersSt(updatedCustomers);
    setInvoicesSt(updatedInvoices);
  
    // Dispatch updated data
    dispatch(
      setInvoices({
        invoices: updatedInvoices,
        products,
        customers: updatedCustomers,
      })
    );
  };
  console.log("Customer reducer:", customers);


  const updateInvoices = (index, updatedInvoice) => {
    // Update standalone invoices list
    console.log("Updated Invoice: ", updatedInvoice);
    const updatedInvoices = invoices?.length > 0 ? [...invoices] : [...invoicesSt];
    updatedInvoices[index] = updatedInvoice;
  
    updatedInvoices[index] = {
      ...updatedInvoices[index],
      ...updatedInvoice,
      products: updatedInvoices[index].Products, // Preserve nested products
    };

    const updatedCustomers = customersSt?.map((customer) =>
      customer.SerialNumber === updatedInvoice.serials
        ? { ...customer, ...updatedInvoice } // Update matching customer based on SerialNumber
        : customer
    );
  
    // Update local states
    setInvoicesSt(updatedInvoices);
    setCustomersSt(updatedCustomers);
  
    console.log("Invoice: ",invoicesSt)
    
    // Dispatch updated data
    dispatch(
      setInvoices({
        invoices: updatedInvoices,
        products,
        customers: updatedCustomers,
      })
    );
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

  const updateProducts = (index, updatedProduct) => {
    // Update standalone product list
    const updatedProducts = [...productsSt];
    updatedProducts[index] = updatedProduct;
  
    // Sync updated product with invoices
    const updatedInvoices = invoicesSt?.map((invoice) => ({
      ...invoice,
      productDetails: invoice?.productDetails?.map((product) =>
        product?.ProductName === updatedProduct?.Name
          ? { ...product, ...updatedProduct } // Update matching product in the invoice
          : product
      ),
    }));
  
    // Update local states
    setProductsSt(updatedProducts);
    setInvoicesSt(updatedInvoices);
  
    // Dispatch updated data
    dispatch(
      setInvoices({
        invoices: updatedInvoices,
        products: updatedProducts,
        customers,
      })
    );
  };
  

  console.log("InvoiceSt: ",invoicesSt);
  console.log("Invoicea: ",invoices);
  // console.log("ProductSt: ",productsSt);


  useEffect(() => {
    // Process invoices and update serialSt
    const processedSerials = processedInvoices?.map((invoice) => invoice["SerialNumber"]);
    console.log("Serials: processed: ",processedSerials)
    setSerialSt(processedSerials || "na");
  }, [invoices]); 


  const processedInvoices = invoicesSt?.map((invoice) => {
    // Process products
    console.log("Invoices: ", invoice)
    const products =
    invoice?.productDetails? invoice.productDetails : 
    invoice?.ProductName? invoice.ProductName: invoice?.ProductDetails? invoice?.Products:invoice?.products?.map((product, index) => ({
      SerialNumber: invoice["SerialNumber"],
      // UUID: uuidv4(),
        ProductName: product["ProductName"] || product["Name"] || product["productName"],
        Qty: product["Qty"] || product["qty"] || product["Quantity"] || 0,
        Tax: product["Tax"] !== undefined ? product["Tax"] : product["tax"] || 0,
        TotalAmount: product["TotalAmount"] || product["totalAmount"] || 0,
      })) || [];
  
      return {
        // UUID: uuidv4(),
        SerialNumber: invoice["SerialNumber"],
        CustomerName: invoice["CustomerName"] || invoice["customerName"],
        PhoneNumber: invoice["PhoneNumber"],
        InvoiceDate: invoice["InvoiceDate"] || "Unknown",
        Subtotal: invoice["Subtotal"] || 0,
        Tax: invoice["Tax"] || 0,
        TotalAmount: invoice["TotalAmount"] || 0,
        BillingAddress: invoice["Address"] || "N/A",
        Products: products,
      };
    });

    console.log("ProcessediNV: ", processedInvoices)


    // console.log(serialSt)


  const processedInvoices2 = invoicesSt?.map((invoice, index) => {
    // Process products
    const products =
    invoice?.productDetails? invoice.productDetails : 
    invoice?.ProductName? invoice.ProductName: invoice?.ProductDetails?.map((product, index) => ({
      serials: serialSt[index],
        ProductName: product["ProductName"] || product["Name"] || product["productName"] || "Unknown",
        Qty: product["Qty"] || product["qty"] || product["Quantity"] || 0,
        Tax: product["Tax"] !== undefined ? product["Tax"] : product["tax"] || 0,
        // PriceWithTax: product["PriceWithTax"] || product["PriceWithTax"] || 0,


      })) || [];
  
    return {
      serials: serialSt[index] || "N/A",
      Products: products,
    };
  });

  console.log("Serailst: ",serialSt)
  

  const tabs = [
    {
      label: "Invoices",
      content: (
        <EditableTable
          data={processedInvoices}
          // onUpdate={(index, updatedRow) =>
          //   handleUpdate("invoices", index, updatedRow)
          // }
          onUpdate={(index, updatedRow) => {
            updateInvoices(index, updatedRow);
            // updateCustomers(index, updatedRow);
            // handleUpdate("invoices", index, updatedRow);
          }}
          tab="Invoices"
        />
      ),
    },
    {
      label: "Products",
      content: (
        <EditableTable
          data={processedInvoices2}
          onUpdate={(index, updatedRow) => {
            updateProducts(index, updatedRow);
            // handleUpdate("products", index, updatedRow);
          }}
          tab="Products"

        />
      ),
    },
    {
      label: "Customers",
      content: (
        <EditableTable
          data={customersSt?.map((customer, idx) => ({
            serials: serialSt[idx] || "N/A",
            // CustomerID: customer.CustomerID,
            CustomerName: customer["CustomerName"], // Now synchronized
            PhoneNumber: customer["PhoneNumber"],
            CustomerName: customer?.CustomerName || customer["CustomerName"],
            PhoneNumber: customer?.PhoneNumber || customer["PhoneNumber"],
            TotalPurchaseAmount: customer["TotalPurchaseAmount"],
            Address: customer?.Address,
          }))}
          onUpdate={(index, updatedRow) => {
            updateCustomers(index, updatedRow);
            // handleUpdate("customers", index, updatedRow);
          }}
          tab="Customers"

        />
      ),
    },
  ];

  return (
    <div>
      <h1>Invoice Manager</h1>
      <FileUploader onUpload={handleUpload} />
      <TabLayout
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {invoices && (
        <div className="save-btn-cont">
        {/* <button
          onClick={() => saveAllToFirestore({ invoices, products, customers })}
          className="save-btn"
       >
          Save
        </button> */}
        </div>
      )}
    </div>
  );
};

export default Home;
