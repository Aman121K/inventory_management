import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import db, { auth } from "../../Firebase";
import LeftMenu from "../LeftMenu/LeftMenu";
import "./EachVendor.css";

function EachVendor() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");

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
      db.collection("vendors")
        .doc(productId)
        .get()
        .then((product) => {
          setProductName(product.data().name);
        });
    }
  }, []);

  const saveproduct = () => {

    const dateTime = Date.now();
    const timestamp = Math.floor(dateTime / 1000);
    if (productName == "") {
      alert("Please enter vendor name");
      return;
    }
    console.log(productId,"prid")
    if (productId === "new") {
      const newProdId = db.collection("vendors").doc().id;
      db.collection("vendors")
        .doc(newProdId)
        .set({
          name: productName,
          createdOn: timestamp,
          customerid: newProdId,
          amount: 0,
        })
        .then((product) => {
          alert("Vendor Added");
        });
    } else {
      db.collection("vendors")
        .doc(productId)
        .update({
          name: productName,
        })
        .then((product) => {
          alert("Vendor Updated");
        });
    }
  };
  return (
    <div className="eachvendor">
      <LeftMenu />
      <div className="eachproductsregion">
        <h4>Enter Vendor Details</h4>
        <h5>Vendor Name</h5>
        <input
          type="text"
          placeholder="Vendor Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <button onClick={saveproduct}>Save</button>
      </div>
    </div>
  );
}

export default EachVendor;
