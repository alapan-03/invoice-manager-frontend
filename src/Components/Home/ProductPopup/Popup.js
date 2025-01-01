import { useState } from "react";
import "./Popup.css";
import { Cross } from "lucide-react";

export default function Popup({ products, onUpdate, onClose }) {
  const [editableProduct, setEditableProduct] = useState(JSON.parse(products)[0]);
  const [editingField, setEditingField] = useState(null); // Track which field is being edited

  const handleInputChange = (field, value) => {
    setEditableProduct({ ...editableProduct, [field]: value });
  };

  const handleSave = () => {
    onUpdate(editableProduct);
    setEditingField(null); // Reset editing field
  };

  const handleCancel = () => {
    setEditingField(null); // Reset editing field without saving
  };

  return (
    <div className="popup-products">
      {/* <Cross className="cross-popup" color="black" onClick={onClose} /> */}
      <div className="cross-popup" onClick={onClose}></div>
      <h3>Edit Product</h3>

      <table className="popup-table">
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {editableProduct && Object.keys(editableProduct).map((key) => (
            <tr key={key}>
              <td>{key}</td>
              <td>
                {editingField === key ? (
                  <input
                    type={key === "Quantity" || key === "UnitPrice" ? "number" : "text"}
                    value={editableProduct[key]}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                  />
                ) : (
                  editableProduct[key]
                )}
              </td>
              <td>
                {editingField === key ? (
                  <>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => setEditingField(key)}>Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
