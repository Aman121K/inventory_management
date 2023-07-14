import React, { useState, useEffect } from "react";
import LeftMenu from "../LeftMenu/LeftMenu";
import { useNavigate } from "react-router-dom";
import "./Orders.css";
import db, { auth } from "../../Firebase";
import { realDate } from "../../content/helper";

function Orders({ type }) {
  const [allOrders, setAllOrders] = useState("");
  const [allFilteredOrders, setAllFilteredOrders] = useState("");
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
    db.collection("orders")
      .where("ordertype", "==", type)
      .get()
      .then((allorders) => {
        allorders.docs.map((product) => {
          tmp.push({ id: product.id, ...product.data() });
        });
        setAllOrders(tmp);
        setAllFilteredOrders(tmp);
      });
  }, []);

  useEffect(() => {
    if (searchterm === "") {
      setAllFilteredOrders(allOrders);
    } else {
      setAllFilteredOrders(
        allOrders.filter((pro) =>
          pro.name.toLowerCase().includes(searchterm.toLowerCase())
        )
      );
    }
  }, [searchterm]);
  return (
    <div className="orders">
      <LeftMenu active={type === "P" ? "orders" : "orderssales"} />
      <div className="ordersregion">
        <div className="addandfilter">
          <button onClick={() => navigate(`/order/new/${type}`)}>
            Add New Order
          </button>
          <input
            type="text"
            placeholder="Search Here"
            value={searchterm}
            onChange={(e) => setSearchterm(e.target.value)}
          />
        </div>
        <div>
          {allOrders.length > 0 && (
            <div className="orderslist">
              <div className="eachorder highlight">
                {type === "P" ? <h4>Vendor Name</h4> : <h4>Customer Name</h4>}
                <h4>Status</h4>
                <h4>No of products</h4>
                <h4>Date</h4>
                <h4 id="blankspace"></h4>
              </div>
              {allFilteredOrders.map((prod) => {
                console.log(prod)
                return (
                  <div className="eachorder">
                    {type === "P" ? (
                      <h4>{prod.vendorname}</h4>
                    ) : (
                      <h4>{prod.customername}</h4>
                    )}
                    <h4>{prod.status}</h4>
                    <h4>{prod.orderproducts.length}</h4>
                    <h4>{realDate(prod?.createdOn)}</h4>
                    <button
                      onClick={() => navigate(`/order/${prod.id}/${type}`)}
                    >
                      Edit Order
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

export default Orders;
