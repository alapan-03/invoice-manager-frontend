import React, { useState, useEffect } from "react";
import Toast from "../Toast";
import { Check, Pencil } from "lucide-react";

const EditableTable = ({ data, onUpdate }) => {
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
    console.log(editedRow)
    onUpdate(index, editedRow);
    setEditingRow(null);
    setNestedEdit(null);
  };

  const handleChange = (e, key) => {
    setEditedRow({ ...editedRow, [key]: e.target.value });
  };

  const handleNestedEdit = (nestedIndex, product) => {
    setNestedEdit(nestedIndex);
    setEditedProduct(product);
  };

  const handleNestedChange = (e, key) => {
    setEditedProduct({ ...editedProduct, [key]: e.target.value });
  };

  const handleNestedSave = (nestedIndex, updatedProduct) => {
    // Clone the current invoice to update
    onUpdate(nestedIndex, updatedProduct);

    setNestedEdit(null); // Exit edit mode
  };
  console.log(editedProduct);
  console.log(editedRow);

  useEffect(() => {
    if (data) {
      const missingFields = data.some((row) =>
        Object.values(row).some(
          (value) => value === null || value === "" || value === undefined
        )
      );
      console.log(missingFields);

      if (missingFields) {
        setToastMessage("Warning: Some fields are missing in the data!");
      }
    }
  }, [data]);

  const closeToast = () => {
    setToastMessage(""); // Clear the toast message
  };

  console.log(editedRow);
  // console.log(nestedEdit)

  const renderValue = (value, key) => {
    if (Array.isArray(value)) {
      return (
        <table className="nested-table">
          <thead>
            <tr>
              {value.length > 0 &&
                Object.keys(value[0]).map((key) => <th key={key}>{key}</th>)}
              {/* <th>Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {value.map((item, idx) => (
              <tr key={idx}>
                {console.log(item)}
                {Object.keys(item).map((key) => (
                  <td key={key}>
                    {nestedEdit === idx ? (
                      <input
                        value={editedProduct[key]}
                        onChange={(e) => handleNestedChange(e, key)}
                      />
                    ) : (
                      item[key]
                    )}
                  </td>
                ))}
                
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else if (typeof value === "object" && value !== null) {
      return <pre>{JSON.stringify(value, null, 2)}</pre>;
    }
    return value;
  };

  console.log(data)

  return (
    <div className="table-container">
      {toastMessage && <Toast message={toastMessage} onClose={closeToast} />}

      <table className="editable-table">
        <thead>
          <tr>
            {data &&
              Object.keys(data[0] || {}).map((key) => <th key={key}>{key}</th>)}
            {data && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data?.length>0 ? data?.map((row, index) => (
            <tr key={index}>
              {Object.keys(row).map((key) => (
                <td key={key}>
                  {editingRow === index ? (
                    key === "products" ? (
                      renderValue(row[key], key)
                    ) : (
                      <input
                        value={editedRow[key]}
                        onChange={(e) => handleChange(e, key)}
                      />
                    )
                  ) : (
                    renderValue(row[key], key)
                  )}
                </td>
              ))}
              <td>
                {editingRow === index ? (
                  <button onClick={() => handleSave(index)}><Check /></button>
                ) : (
                  <button onClick={() => handleEdit(index)}><Pencil /></button>
                )}
              </td>
            </tr>
          )):
        (
          <div>
            <tr className="nothing-cont">
              <div className="nothing1">Nothing to show!</div>
              <div className="nothing2">Please drag and drop or click on the area to upload a file</div>
            </tr>
          </div>
        )
        }
        </tbody>
      </table>
    </div>
  );
};

export default EditableTable;
