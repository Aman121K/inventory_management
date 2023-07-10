import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import db, { auth } from "../../Firebase";
import LeftMenu from "../LeftMenu/LeftMenu";
import "./EachProduct.css";

function EachProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [unit, setUnit] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
      } else {
        navigate("/");
      }
    });
  }, []);

  useEffect(() => {
    if (productId !== "new") {
      db.collection("products")
        .doc(productId)
        .get()
        .then((product) => {
          setProductName(product.data().name);
          setUnit(product.data().unit);
        });
    }
  }, []);

  const saveproduct = () => {
    const dateTime = Date.now();
    const timestamp = Math.floor(dateTime / 1000);
    if (productName == "" || unit == "") {
      alert("Please enter both product name and unit");
      return;
    }
    if (productId === "new") {
      const newProdId = db.collection("products").doc().id;
      db.collection("products")
        .doc(newProdId)
        .set({
          name: productName,
          unit: unit,
          createdOn: timestamp,
          price: 0,
          stock: 0,
          units: 0,
        })
        .then((product) => {
          alert("Product Added");
        });
    } else {
      db.collection("products")
        .doc(productId)
        .update({
          name: productName,
          unit: unit,
          createdOn: timestamp,
        })
        .then((product) => {
          alert("Product Updated");
        });
    }
  };
  return (
    <div className="eachproducts">
      <LeftMenu />
      <div className="eachproductsregion">
        <h4>Enter Product Details</h4>
        <h5>Product Name</h5>
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <h5>Unit of measurement</h5>
        <input
          type="text"
          placeholder="Unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        />
        <button onClick={saveproduct}>Save</button>
      </div>
    </div>
  );
}

export default EachProduct;
