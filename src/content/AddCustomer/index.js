import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import db, { auth } from "../../Firebase";
// import "./EachVendor.css";
import "../../components/EachVendor/EachVendor.css"

import { Modal } from "@mui/material";

function AddCustomerModal({ open, handleClose }) {
    const navigate = useNavigate();

    const [productName, setProductName] = useState("");

    const saveproduct = () => {
        const dateTime = Date.now();
        const timestamp = Math.floor(dateTime / 1000);
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
                setProductName()
                alert("Customer Added");
                handleClose()
            });

    };
    return (
        <Modal
            onClose={handleClose}
            open={open}
            style={{
                position: 'absolute',
                border: '1px',
                backgroundColor: 'gray',
                boxShadow: '2px',
                height: 500,
                width: 540,
                margin: 'auto'
            }}
        >
            <div style={{marginLeft:100,marginTop:100}} className="eachproductsregion">
                <h4 style={{color:'white'}}>Add New Customer</h4>
                <h5 style={{color:'white'}}>Customer Name</h5>
                <input
                    type="text"
                    placeholder="Customer Name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                />
                <button onClick={saveproduct}>Save</button>
            </div>
        </Modal>
    );
}

export default AddCustomerModal;
