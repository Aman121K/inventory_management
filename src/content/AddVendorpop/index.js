// import React, { useState } from "react";
// import Modal from '@mui/material/Modal';
// const VendorAddModal = ({ open, handleClose }) => {
//     const [vendorName,setVendorName]=useState();
//     return (
//         <div>
//             <Modal
//                 onClose={handleClose}
//                 open={open}
//                 style={{
//                     position: 'absolute',
//                     border: '1px',
//                     backgroundColor: 'gray',
//                     boxShadow: '2px solid black',
//                     height: 500,
//                     width: 540,
//                     margin: 'auto'
//                 }}
//             >
//                  <div>
//                 <h5>Vendor Name</h5>
//                 <input
//                   type="number"
//                   placeholder="Vendor name"

//                   onChange={(e) =>
//                     setVendorName(e.target.value)
//                   }
//                 />
//               </div>
//             </Modal>
//         </div>
//     )
// }
// export default VendorAddModal


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import db, { auth } from "../../Firebase";
// import "./EachVendor.css";
import "../../components/EachVendor/EachVendor.css"

import { Modal } from "@mui/material";

function VendorAddModal({ open, handleClose }) {
    const navigate = useNavigate();

    const [productName, setProductName] = useState("");

    const saveproduct = () => {
        const dateTime = Date.now();
        const timestamp = Math.floor(dateTime / 1000);
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
                setProductName()
                handleClose()
                // alert("Vendor Added");
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
            <div  style={{marginLeft:100,marginTop:100}} className="eachproductsregion">
                <h4 style={{color:'white'}}>Enter Vendor Details</h4>
                <h5 style={{color:'white'}}>Vendor Name</h5>
                <input
                    type="text"
                    placeholder="Vendor Name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                />
                <button onClick={saveproduct}>Save</button>
            </div>
        </Modal>
    );
}

export default VendorAddModal;
