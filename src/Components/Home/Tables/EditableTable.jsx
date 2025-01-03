import React, { useState, useEffect } from "react";
import Toast from "./../../Toast";
import { Check, Pencil, Plus, PlusIcon } from "lucide-react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { TableRows } from "@mui/icons-material";
import toast, { Toaster } from "react-hot-toast";
import "./Table2.css"

const EditableTable = ({ data, onUpdate, tab, showPopup }) => {
  const [editingRow, setEditingRow] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [nestedEdit, setNestedEdit] = useState(null); // Track nested row being edited
  const [editedProduct, setEditedProduct] = useState({}); // Track product edits
  const [toastMessage, setToastMessage] = useState(""); // Track toast message

  const handleEdit = (index) => {
    const row = data[index];
    if (row) {
      setEditingRow(index);
      // setEditedRow(data[index]);
      setEditedRow({ ...row });
    }
  };

  const handleSave = (index) => {
    const updatedRow = data[index];
    console.log("row", updatedRow);
    console.log(editedRow, "roe");
    onUpdate(index, editedRow);
    setEditingRow(null);
  };

  const handleChange = (e, key) => {
    setEditedRow({ ...editedRow, [key]: e.target.value });
  };

  useEffect(() => {
    if (data) {
      const missingFields = data.length>0 && data.some((row) =>
        Object.values(row).some(
          (value) => value === null || value === "" || value === undefined
        )
      );
      console.log(missingFields);

      // if (missingFields) {
      //   // setToastMessage("Warning: Some fields are missing in the data!");
      //   toast.error("Warning: Some fields are missing in the data!")
      // }
    }
  }, [data]);

  // const closeToast = () => {
  //   setToastMessage(""); // Clear the toast message
  // };

  // console.log(nestedEdit)

  const renderValue = (value, key, serial) => {
    // console.log("avlus", value);
    // console.log("serial", serial);
    if (Array.isArray(value)) {
      return (
        <TableContainer className="nested-table" align="center">
          {value?.map(
            (item, idx) =>
              (item.productName || item.ProductName || item.Name || item) && (
                <div
                  className="productName-cont"
                  onClick={() => showPopup(item.productSerialNo)}
                >
                  <p>
                    {item.productName || item.ProductName || item.Name || item}
                  </p>
                  {/* <p>{item.productSerialNo}</p> */}
                  <Plus size={25} />
                </div>
              )
          )}
          {/* </tbody> */}
        </TableContainer>
      );
    } else if (typeof value === "object" && value !== null) {
      return <pre>{JSON.stringify(value, null, 2)}</pre>;
    }
    return value;
  };

  console.log("Data", data);

  return (
    <>
      {data?.length > 0 ? (
    <Box sx={{ overflowX: "auto"}} className="table-container">
    {/* {toastMessage && <Toast message={toastMessage} onClose={closeToast} />} */}

    <div>
        <Toaster />
      </div>

    <TableContainer sx={{ minWidth: 1200, borderRadius:"5px"}} style={{borderRadius:"5px"}}>
      <Table className="editable-table" sx={{borderRadius:"10px"}} style={{borderRadius:"10px"}}>
        <TableHead className="table-head">
          <TableRow>
            {data && 
            Object.keys(data[0] || {})
                .filter((key) => !(editingRow !== null && key === "Products")) // Exclude "products" column when editing
                .map((key) => <th key={key} style={{ padding:"1.5rem", textAlign: "left" }}>{key}</th>)}
            {data && <th>Actions</th>}
          </TableRow>
        </TableHead>
        <TableBody style={{borderRadius:"100px"}}>
            {data.map((row, index) => (
              <TableRow key={index}>
                {Object.keys(row)
                  .filter((key) => !(editingRow !== null && key === "Products")) // Exclude "products" column when editing
                  .map((key) => (
                    <TableCell  style={{borderRight:"1px solid #cccccc" , borderBottom:"1px solid #cccccc"}} key={key} align="center">
                      {editingRow === index ? (
                        key === "products" ? null : (
                          <TextField
                            value={editedRow[key]}
                            onChange={(e) => handleChange(e, key)}
                          />
                        )
                      ) : (
                        renderValue(row[key], key)
                      )}
                    </TableCell>
                  ))}

                <TableCell align="center">
                  {editingRow === index ? (
                    <button onClick={() => handleSave(index)}>
                      <Check />
                    </button>
                  ) : (
                    <button onClick={() => handleEdit(index)}>
                      <Pencil />
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        </Table>
        </TableContainer>
        </Box>
      ) 
      : (
        <TableRow>
          <TableCell className="nothing-cont">
            <div className="nothing-cont">
            <div><PlusIcon/></div>
            <div className="nothing1">Nothing to show!</div>
            <div className="nothing2">
              Please drag and drop or click on the area to upload a file
            </div>
            </div>
          </TableCell>
        </TableRow>
      )}
      </>
  );
};

export default EditableTable;
