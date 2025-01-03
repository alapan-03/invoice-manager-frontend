import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
} from "@mui/material";
import { useParams } from "react-router";
import { useAuth } from "./../../AuthProvider";
import useGetFromFirestore from "./../../app/Hooks/useGetFromFirestore";
import "./CardDetails.css"
import useSaveToFirestore from "../../app/Hooks/useSaveToFirestore";
import DetailsPopup from "../Home/Tables/DetailsPopup/DetailsPopup";
import Popup from "../Home/ProductPopup/Popup";

export default function CardDetails() {
  let { sno } = useParams();
  const { user } = useAuth();
  const { invoices } = useGetFromFirestore("Invoices");

  const {saveAllToFirestore, saveAllToFirestoreEdit} = useSaveToFirestore();

  // Find the matching invoice
  const matchingInvoice = invoices.find((invoice) => invoice.id === sno);

  // State for editable invoices and edit mode
  const [editableInvoices, setEditableInvoices] = useState(
    matchingInvoice?.invoices || []
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (updatedProduct) => {
    const updatedInvoices = [...matchingInvoice?.invoices];
    updatedInvoices.forEach((invoice) => {
      const productIndex = invoice.ProductDetails.findIndex(
        (prod) => prod.ProductName === selectedProduct.ProductName
      );
      if (productIndex !== -1) {
        invoice.ProductDetails[productIndex] = updatedProduct;
      }
    });
    setEditableInvoices(updatedInvoices);
    setIsModalOpen(false);
  };


  console.log(matchingInvoice)

  // Handle field changes
  const handleInputChange = (index, field, value) => {
    const updatedInvoices = [...matchingInvoice?.invoices ];
    updatedInvoices[index][field] = value;
    setEditableInvoices(updatedInvoices);
  };

  // Save changes
  const handleSave = () => {
    console.log("Updated Invoices:", editableInvoices);
    alert("Changes saved successfully!");
    setIsEditMode(false);
    // Add logic to save the data to Firestore here
  };

  // Cancel changes
  const handleCancel = () => {
    setEditableInvoices(matchingInvoice?.invoices || []);
    setIsEditMode(false);
  };

  // console.log("Incvcf",matchingInvoice?.invoices)

  async function handleDbSave(){
    const docId = await saveAllToFirestoreEdit("Invoices",matchingInvoice?.invoices, matchingInvoice?.name, matchingInvoice?.description, matchingInvoice?.id);
    if (docId) {
      alert(`Data saved successfully with ID: ${docId}`);
    }
    else{
      alert("Error")
    }
  }

  return (
    <>
    {/* <Popup products={matchingInvoice?.invoices?.productDetails}/> */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Serial Number</strong></TableCell>
              <TableCell><strong>Customer Name</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Due Date</strong></TableCell>
              <TableCell><strong>Billing Address</strong></TableCell>
              <TableCell><strong>Subtotal</strong></TableCell>
              <TableCell><strong>Tax</strong></TableCell>
              <TableCell><strong>Total Amount</strong></TableCell>
              <TableCell><strong>Products</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matchingInvoice?.invoices.map((invoice, index) => (
              
              <TableRow key={index}>
                {console.log("Incvcf",invoice?.ProductDetails)}
                {/* <Popup products={invoice?.ProductDetails}/> */}
                <TableCell>
                  {isEditMode ? (
                    <TextField
                      value={invoice.SerialNumber || ""}
                      onChange={(e) =>
                        handleInputChange(index, "SerialNumber", e.target.value)
                      }
                    />
                  ) : (
                    invoice.SerialNumber || "N/A"
                  )}
                </TableCell>
                <TableCell>
                  {isEditMode ? (
                    <TextField
                      value={invoice.CustomerName || ""}
                      onChange={(e) =>
                        handleInputChange(index, "CustomerName", e.target.value)
                      }
                    />
                  ) : (
                    invoice.CustomerName || "N/A"
                  )}
                </TableCell>
                <TableCell>
                  {isEditMode ? (
                    <TextField
                      value={invoice.Date || ""}
                      onChange={(e) =>
                        handleInputChange(index, "Date", e.target.value)
                      }
                    />
                  ) : (
                    invoice.Date || "N/A"
                  )}
                </TableCell>
                <TableCell>
                  {isEditMode ? (
                    <TextField
                      value={invoice.DueDate || ""}
                      onChange={(e) =>
                        handleInputChange(index, "DueDate", e.target.value)
                      }
                    />
                  ) : (
                    invoice.DueDate || "N/A"
                  )}
                </TableCell>
                <TableCell>
                  {isEditMode ? (
                    <TextField
                      value={invoice.BillingAddress || ""}
                      onChange={(e) =>
                        handleInputChange(index, "BillingAddress", e.target.value)
                      }
                    />
                  ) : (
                    invoice.BillingAddress || "N/A"
                  )}
                </TableCell>
                <TableCell>
                  {isEditMode ? (
                    <TextField
                      type="number"
                      value={invoice.Subtotal || 0}
                      onChange={(e) =>
                        handleInputChange(index, "Subtotal", e.target.value)
                      }
                    />
                  ) : (
                    invoice.Subtotal || 0
                  )}
                </TableCell>
                <TableCell>
                  {isEditMode ? (
                    <TextField
                      type="number"
                      value={invoice.Tax || 0}
                      onChange={(e) =>
                        handleInputChange(index, "Tax", e.target.value)
                      }
                    />
                  ) : (
                    invoice.Tax || 0
                  )}
                </TableCell>
                <TableCell>
                  {isEditMode ? (
                    <TextField
                      type="number"
                      value={invoice.TotalAmount || 0}
                      onChange={(e) =>
                        handleInputChange(index, "TotalAmount", e.target.value)
                      }
                    />
                  ) : (
                    invoice.TotalAmount || 0
                  )}
                </TableCell>
                <TableCell>
                {invoice.ProductDetails && invoice.ProductDetails.length > 0 ? (
  invoice.ProductDetails.map((product, i) =>
    isEditMode ? (
      <TextField
        key={i}
        value={product.ProductName || product.productName || ""}
        onChange={(e) => {
          const updatedProducts = [...invoice.ProductDetails];
          updatedProducts[i].ProductName = e.target.value;
          handleInputChange(index, "ProductDetails", updatedProducts);
        }}
      />
    ) : (
      <div
        key={i}
        className="card-details-product"
        onClick={() => handleProductClick(product)}
      >
        <span>{product.ProductName || product.productName || product.name || product.Name || "Unknown Product"}</span>
      </div>
    )
  )
) : invoice.productDetails && invoice.productDetails.length > 0 ? (
  invoice.productDetails.map((product, i) =>
    isEditMode ? (
      <TextField
        key={i}
        value={product.ProductName || product.productName || product.name || product.Name ||""}
        onChange={(e) => {
          const updatedProducts = [...invoice.productDetails];
          updatedProducts[i].ProductName = e.target.value;
          handleInputChange(index, "ProductDetails", updatedProducts);
        }}
      />
    ) : (
      <div
        key={i}
        className="card-details-product"
        onClick={() => handleProductClick(product)}
      >
        <span>{product.ProductName || product.productName || "Unknown Product"}</span>
      </div>
    )
  )
) : (
  "No Products"
)}

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {isModalOpen && selectedProduct && (
        <Popup
          products={JSON.stringify([selectedProduct])}
          onUpdate={handleSaveProduct}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <div style={{ marginTop: "20px" }}>
        {isEditMode ? (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              style={{ marginRight: "10px" }}
            >
              Save
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </>
        ) : (
          <div>
          <Button variant="contained" color="primary" onClick={() => setIsEditMode(true)}>
            Edit
          </Button>
        <button onClick={handleDbSave}>Save</button>
        </div>
        )}

      </div>
    </>
  );
}
