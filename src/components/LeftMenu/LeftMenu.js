import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../Firebase";
import "./LeftMenu.css";

function LeftMenu({ active }) {
  const navigate = useNavigate();

  const signout = () => {
    auth.signOut().then(() => {
      navigate("/");
    });
  };

  console.log("activee>>",active)

  return (
    <div className="leftmenu">
      <div className="div1">
        <button
          className={active === "home" ? "active" : ""}
          onClick={() => navigate("/home")}
        >
          Home
        </button>
        <button
          className={active === "products" ? "active" : ""}
          onClick={() => navigate("/products")}
        >
          Products
        </button>
        <button
          className={active === "orders" ? "active" : ""}
          onClick={() => navigate("/orders")}
        >
          Purchase Orders
        </button>
        <button
          className={active === "orderssales" ? "active" : ""}
          onClick={() => navigate("/orderssales")}
        >
          Sales Orders
        </button>
        <button
          className={active === "payments" ? "active" : ""}
          onClick={() => navigate("/payments")}
        >
          Payments
        </button>
        <button
          className={active === "collections" ? "active" : ""}
          onClick={() => navigate("/collections")}
        >
          Collections
        </button>
        <button
          className={active === "customers" ? "active" : ""}
          onClick={() => navigate("/customers")}
        >
          Customers
        </button>
        <button
          className={active === "vendors" ? "active" : ""}
          onClick={() => navigate("/vendors")}
        >
          Vendors
        </button>
      </div>
      <div>
        <button onClick={() => signout()}>Sign Out</button>
      </div>
    </div>
  );
}

export default LeftMenu;
