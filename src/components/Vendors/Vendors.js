import React, { useState, useEffect } from "react";
import db, { auth } from "../../Firebase";
import { useNavigate } from "react-router-dom";
import LeftMenu from "../LeftMenu/LeftMenu";
import "./Vendors.css";

function Vendors() {
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
    db.collection("vendors")
      .get()
      .then((allproducts) => {
        allproducts.docs.map((product) => {
          tmp.push({ id: product.id, ...product.data() });
        });
        setAllProducts(tmp);
        setAllFilteredProducts(tmp);
      });
  }, []);

  useEffect(() => {
    if (searchterm === "") {
      setAllFilteredProducts(allProducts);
    } else {
      setAllFilteredProducts(
        allProducts.filter((pro) =>
          pro.name.toLowerCase().includes(searchterm.toLowerCase())
        )
      );
    }
  }, [searchterm]);

  return (
    <div className="vendors">
      <LeftMenu active="products" />
      <div className="vendorsregion">
        <div className="addandfilter">
          <button onClick={() => navigate(`/vendor/new`)}>
            Add New Vendor
          </button>
          <input
            type="text"
            placeholder="Search Here"
            value={searchterm}
            onChange={(e) => setSearchterm(e.target.value)}
          />
        </div>
        <div>
          {allProducts.length > 0 && (
            <div className="productslist">
              <div className="eachproduct highlight">
                <h4>Vendor Name</h4>
              </div>
              {allFilteredProducts.map((prod) => {
                return (
                  <div className="eachproduct">
                    <h4>{prod.name}</h4>
                    <h4>Amount {prod.amount}</h4>
                    <button
                      style={{ marginRight: 10 }}
                      onClick={() => navigate(`/vendor/${prod.id}`)}
                    >
                      Edit Vendor
                    </button>
                    <button
                      onClick={() => navigate(`/ledger/vendor/${prod.id}`)}
                    >
                      View Ledger
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

export default Vendors;
