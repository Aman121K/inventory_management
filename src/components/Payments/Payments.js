import React, { useState, useEffect } from "react";
import db, { auth } from "../../Firebase";
import { useNavigate } from "react-router-dom";
import LeftMenu from "../LeftMenu/LeftMenu";
import "./Payments.css";

function Payments() {
  const [allPayments, setAllPayments] = useState([]);
  const [searchterm, setSearchterm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
      } else {
        navigate("/");
      }
    });
  }, []);

  useEffect(() => {
    var tmp = [];
    db.collection("payments")
      .get()
      .then((allproducts) => {
        allproducts.docs.map((product) => {
          tmp.push({ id: product.id, ...product.data() });
        });
        setAllPayments(tmp);
      });
  }, []);

  return (
    <div className="payments">
      <LeftMenu active="payments" />
      <div className="paymentsregion">
        <div className="addandfilter">
          <button onClick={() => navigate(`/payment/new`)}>
            Add New Payment
          </button>
          <input
            type="text"
            placeholder="Search Here"
            value={searchterm}
            onChange={(e) => setSearchterm(e.target.value)}
          />
        </div>
        <div>
          {allPayments.length > 0 && (
            <div className="productslist">
              <div className="eachproduct highlight">
                <h4>Date of Payment</h4>
                <h4>Amount</h4>
                <h4>Paid to</h4>
              </div>
              {allPayments.map((prod) => {
                return (
                  <div className="eachproduct">
                    <h4>{prod.dateofpayment}</h4>
                    <h4>Rs {prod.amount}</h4>
                    <h4>Rs {prod.paidto}</h4>
                    <button
                      style={{ marginRight: 10 }}
                      onClick={() => navigate(`/payment/${prod.id}`)}
                    >
                      Edit Payment
                    </button>
                    <button onClick={() => navigate(`/payment/${prod.id}`)}>
                      View Payment
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Payments;
