import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import db, { auth } from "../../Firebase";
import LeftMenu from "../LeftMenu/LeftMenu";
import "./EachCustomer.css";

function EachCustomer() {
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
      db.collection("customers")
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
      alert("Please enter customer name");
      return;
    }
    if (productId === "new") {
      const newProdId = db.collection("customers").doc().id;
      db.collection("customers")
        .doc(newProdId)
        .set({
          name: productName,
          createdOn: timestamp,
          customerid: newProdId,
          amount: 0,
        })
        .then((product) => {
          alert("Customer Added");
        });
    } else {
      db.collection("customers")
        .doc(productId)
        .update({
          name: productName,
        })
        .then((product) => {
          alert("Customer Updated");
        });
    }
  };
  return (
    <div className="eachcustomer">
      <LeftMenu />
      <div className="eachproductsregion">
        <h4>Enter Customer Details</h4>
        <h5>Customer Name</h5>
        <input
          type="text"
          placeholder="Customer Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <button onClick={saveproduct}>Save</button>
      </div>
    </div>
  );
}

export default EachCustomer;
