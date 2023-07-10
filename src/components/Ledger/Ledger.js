import React, { useState, useEffect } from "react";
import db, { auth } from "../../Firebase";
import { useNavigate, useParams } from "react-router-dom";
import LeftMenu from "../LeftMenu/LeftMenu";
import "./Ledger.css";

function Ledger() {
  const { type, personId } = useParams();

  const [allProducts, setAllProducts] = useState([]);
  const [allFilteredProducts, setAllFilteredProducts] = useState([]);
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
    if (type === "customer") {
      db.collection("customers")
        .doc(personId)
        .collection("ledger")
        .orderBy("createdOn", "desc")
        .get()
        .then((allproducts) => {
          allproducts.docs.map((product) => {
            tmp.push({ id: product.id, ...product.data() });
          });
          setAllProducts(tmp);
          setAllFilteredProducts(tmp);
        });
    } else {
      db.collection("vendors")
        .doc(personId)
        .collection("ledger")
        .orderBy("createdOn")
        .get()
        .then((allproducts) => {
          allproducts.docs.map((product) => {
            tmp.push({ id: product.id, ...product.data() });
          });
          setAllProducts(tmp);
          setAllFilteredProducts(tmp);
        });
    }
  }, []);

  return (
    <div className="ledger">
      <LeftMenu active="customers" />
      <div className="customersregion">
        {/* <div className="addandfilter">
          <input
            type="text"
            placeholder="Search Here"
            value={searchterm}
            onChange={(e) => setSearchterm(e.target.value)}
          />
        </div> */}
        <div>
          {allProducts.length > 0 && (
            <div className="productslist">
              <div className="eachproduct highlight">
                <h4>Ledger</h4>
              </div>
              {allFilteredProducts.map((prod) => {
                return (
                  <div className="eachproduct">
                    <h4>{prod.type}</h4>
                    <h4>Amount {prod.ordervalue}</h4>
                    <h4>
                      {new Date(prod.createdOn * 1000).toLocaleDateString(
                        "en-US"
                      )}
                    </h4>
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

export default Ledger;
