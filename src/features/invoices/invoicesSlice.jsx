import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  invoices: [],
  products: [],
  customers: [],
};

// const invoicesSlice = createSlice({
//   name: "invoices",
//   initialState,
//   reducers: {
//     setInvoices(state, action) {
//       const { invoices, products, customers } = action?.payload;
//       console.log("Payload received in setInvoices:", action?.payload); // Debugging
//       state.invoices = invoices || []; // Fallback to empty array if undefined
//       state.products = products || [];
//       state.customers = customers || [];
//     }
//     ,
//     updateInvoice(state, action) {
//       const { index, updatedRow } = action?.payload;
//       state.invoices[index] = updatedRow;
//     },
//     updateProduct(state, action) {
//       const { index, updatedRow } = action?.payload;
//       state.products[index] = updatedRow;
//     },
//     updateCustomer(state, action) {
//       const { index, updatedRow } = action?.payload;
//       state.customers[index] = updatedRow;
//     },
//   },
// });


export const invoicesSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    setInvoices: (state, action) => {
      // console.log(state.payload?.invoices)
      state.invoices = action?.payload?.invoices;
      state.products = action?.payload?.products;
      state.customers = action?.payload?.customers;
    },
    updateInvoice: (state, action) => {
      const { index, updatedRow } = action?.payload;
      // state.invoices[index] = updatedRow;
      state.invoices?.splice(index, 1, updatedRow);
      console.log(updatedRow)

      // Synchronize common fields
      const commonKeys = ["CustomerName", "PhoneNumber", "Address"];
      commonKeys?.forEach((key) => {
        if (updatedRow[key]) {
          // Update all datasets with the new value
          state.customers?.forEach((customer) => {
            if (customer[key]) customer[key] = updatedRow[key];
          });
          state.products?.forEach((product) => {
            if (product[key]) product[key] = updatedRow[key];
          });
        }
      });
    // },
    if (updatedRow?.productDetails) {
      updatedRow?.Products?.forEach((updatedProduct) => {
        state.products?.forEach((product) => {
          if (product?.ProductName === updatedProduct?.ProductName) {
            Object?.assign(product, updatedProduct);
          }
        });
      });
    }
  },
    updateCustomer: (state, action) => {
      const { index, updatedRow } = action?.payload;
      state.customers[index] = updatedRow;

      // Synchronize common fields
      const commonKeys = ["CustomerName", "PhoneNumber", "Address"];
      commonKeys?.forEach((key) => {
        if (updatedRow[key]) {
          // Update all datasets with the new value
          state.invoices?.forEach((invoice) => {
            if (invoice[key]) invoice[key] = updatedRow[key];
          });
          state.products?.forEach((product) => {
            if (product[key]) product[key] = updatedRow[key];
          });
        }
      });
    },
    // updateProduct: (state, action) => {
    //   const { index, updatedRow } = action?.payload;
    //   state.products[index] = updatedRow;

    //   // Synchronize common fields
    //   const commonKeys = ["CustomerName", "PhoneNumber", "Address"];
    //   commonKeys?.forEach((key) => {
    //     if (updatedRow[key]) {
    //       // Update all datasets with the new value
    //       state.invoices?.forEach((invoice) => {
    //         if (invoice[key]) invoice[key] = updatedRow[key];
    //       });
    //       state.customers?.forEach((customer) => {
    //         if (customer[key]) customer[key] = updatedRow[key];
    //       });
    //     }
    //   });
    //   state.invoices?.forEach((invoice) => {
    //     if (invoice.productDetails) {
    //       invoice.productDetails?.forEach((invoiceProduct) => {
    //         if (invoiceProduct?.PRODUCTNAME === updatedRow?.PRODUCTNAME) {
    //           Object?.assign(invoiceProduct, updatedRow);
    //         }
    //       });
    //     }
    //   });
    // },

    updateProduct: (state, action) => {
      const { index, updatedRow } = action?.payload;
    
      // Update the product in the products array
      state.products[index] = { ...state.products[index], ...updatedRow };
    
      // Synchronize common fields
      const commonKeys = ["CustomerName", "PhoneNumber", "Address"];
      commonKeys?.forEach((key) => {
        if (updatedRow[key]) {
          // Update invoices
          state.invoices?.forEach((invoice) => {
            if (invoice[key]) invoice[key] = updatedRow[key];
          });
          // Update customers
          state.customers?.forEach((customer) => {
            if (customer[key]) customer[key] = updatedRow[key];
          });
        }
      });

      
      // Synchronize products with invoice.productDetails
      state.invoices?.forEach((invoice) => {
        console.log(invoice.ProductName? "P"+invoice.ProductName : "p"+invoice.productName)
        if (invoice.productDetails) {
          invoice.productDetails = invoice.productDetails?.map((invoiceProduct) =>
            invoiceProduct?.ProductName === updatedRow?.ProductName
              ? { ...invoiceProduct, ...updatedRow } // Update only the matching product
              : invoiceProduct // Keep other products unchanged
          );
        }
      });
    },
    
  },
});

export const { setInvoices, updateInvoice, updateCustomer, updateProduct } =
  invoicesSlice.actions;

export default invoicesSlice.reducer;
