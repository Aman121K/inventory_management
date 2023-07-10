import React, { useState, useEffect } from "react";
import db, { auth } from "../../Firebase";
import { useNavigate } from "react-router-dom";
import LeftMenu from "../LeftMenu/LeftMenu";
import "./Collections.css";

function Collections() {
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
    db.collection("collections")
      .get()
      .then((allproducts) => {
        allproducts.docs.map((product) => {
          tmp.push({ id: product.id, ...product.data() });
        });
        setAllPayments(tmp);
      });
  }, []);

  return (
    <div className="collections">
      <LeftMenu active="collections" />
      <div className="collectionsregion">
        <div className="addandfilter">
          <button onClick={() => navigate(`/collection/new`)}>
            Add New Collection
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
                <h4>Date of Collection</h4>
                <h4>Amount</h4>
                <h4>Collected From</h4>
              </div>
              {allPayments.map((prod) => {
                return (
                  <div className="eachproduct">
                    <h4>{prod.dateofpayment}</h4>
                    <h4>Rs {prod.amount}</h4>
                    <h4>Rs {prod.collectedfrom}</h4>
                    <button
                      style={{ marginRight: 10 }}
                      onClick={() => navigate(`/collection/${prod.id}`)}
                    >
                      Edit Payment
                    </button>
                    <button onClick={() => navigate(`/collection/${prod.id}`)}>
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

export default Collections;
