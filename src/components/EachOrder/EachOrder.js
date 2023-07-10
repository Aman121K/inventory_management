import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import db, { auth } from "../../Firebase";
import LeftMenu from "../LeftMenu/LeftMenu";
import "./EachOrder.css";

function EachOrder() {
  const { orderId, orderType } = useParams();
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [paymentMerchantName, setPaymentMerchantName] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [orderStatus, setOrderStatus] = useState("B");
  const [orderProducts, setOrderProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [dropDownItems, setDropDownItems] = useState([]);

  const [currentnoofproducts, setcurrentnoofproducts] = useState(1);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
      } else {
        navigate("/");
      }
    });
  }, []);

  useEffect(() => {
    if (orderType === "P") {
      let tmp = ["-"];
      db.collection("vendors")
        .get()
        .then((dals) => {
          dals.docs.map((eachven) => {
            tmp.push({ id: eachven.id, name: eachven.data().name });
          });
          setDropDownItems(tmp);
        });
    } else {
      let tmp = ["-"];
      db.collection("customers")
        .get()
        .then((dals) => {
          dals.docs.map((eachven) => {
            tmp.push({ id: eachven.id, name: eachven.data().name });
          });
          setDropDownItems(tmp);
        });
    }
  }, []);

  useEffect(() => {
    var tmp = [{ id: 0, name: "-" }];
    db.collection("products")
      .get()
      .then((allproducts) => {
        allproducts.docs.map((product) => {
          tmp.push({
            id: product.id,
            name: product.data().name,
            unit: product.data().unit,
          });
        });
        setAllProducts(tmp);
      });
  }, []);

  useEffect(() => {
    if (orderId !== "new") {
      db.collection("orders")
        .doc(orderId)
        .get()
        .then((product) => {
          setOrderStatus(product.data().status);
          setOrderProducts(product.data().orderproducts);
          setcurrentnoofproducts(product.data().orderproducts.length);
          setCustomerName(product.data().customername);
          setCustomerId(product.data().customerid);
          setVendorName(product.data().vendorname);
          setVendorId(product.data().vendorid);
          setPaymentMerchantName(product.data().paymentmerchantname);
          setOrderDate(product.data().orderdate);
        });
    }
  }, []);

  useEffect(() => {
    const oldArray = [...orderProducts];
    const newArray = new Array(currentnoofproducts);
    for (let i = 0; i < oldArray.length; i++) {
      if (newArray.length > i) {
        newArray[i] = oldArray[i];
      }
    }
    for (let i = oldArray.length; i < newArray.length; i++) {
      newArray[i] = {
        productname: "",
        noofunits: "",
        cpperunit: "",
        spperunit: "",
        id: "",
      };
    }

    setOrderProducts(newArray);
  }, [currentnoofproducts]);

  const onRadioChanged = (e) => {
    setOrderStatus(e.target.value);
  };

  const manintainstock = async () => {
    if (
      orderType === "P" &&
      (vendorName === "" || vendorName === "-" || orderDate === "")
    ) {
      alert("Order date and vendor name are mandatory");
      return;
    }
    if (
      orderType === "S" &&
      (customerName === "" || customerName === "-" || orderDate === "")
    ) {
      alert("Order date and customer name are mandatory");
      return;
    }
    for (let i = 0; i < orderProducts.length; i++) {
      if (
        orderProducts[i]["productname"] === "" ||
        orderProducts[i]["noofunits"] === "" ||
        (orderProducts[i]["cpperunit"] === "" && orderType === "P") ||
        (orderProducts[i]["spperunit"] === "" && orderType === "S")
      ) {
        alert("Please enter all product information");
        return;
      }
    }
    const dateTime = Date.now();
    const timestamp = Math.floor(dateTime / 1000);
    orderProducts.map(async (eachProduct) => {
      console.log(eachProduct);
      if (orderId === "new") {
        const newid = db
          .collection("stocks")
          .doc(eachProduct.id)
          .collection("purchasehistory")
          .doc().id;
        await db
          .collection("stocks")
          .doc(eachProduct.id)
          .collection("purchasehistory")
          .doc(newid)
          .set({
            noofunits: eachProduct.noofunits,
            ordertype: orderType,
            createdon: timestamp,
            cpperunit: eachProduct.cpperunit,
            spperunit: eachProduct.spperunit,
            orderid: newid,
          });
        db.collection("products")
          .doc(eachProduct.id)
          .get()
          .then((oldproddata) => {
            let existingstock = Number(oldproddata?.data()?.stock) || 0;
            let existingpurchasestock = Number(oldproddata?.data()?.units) || 0;
            let avgprice = Number(oldproddata?.data()?.price) || 0;
            if (orderType === "P") {
              db.collection("products")
                .doc(eachProduct.id)
                .update({
                  price:
                    avgprice === 0
                      ? eachProduct.cpperunit
                      : (avgprice + Number(eachProduct.cpperunit)) / 2,
                  stock: existingstock + Number(eachProduct.noofunits),
                  units: existingpurchasestock + Number(eachProduct.noofunits),
                });
            } else {
              db.collection("products")
                .doc(eachProduct.id)
                .update({
                  stock: existingstock - eachProduct.noofunits,
                });
            }
          });
      } else {
        await db
          .collection("stocks")
          .doc(eachProduct.id)
          .collection("purchasehistory")
          .where("orderid", "==", orderId)
          .get()
          .then((alldatas) => {
            alldatas.docs.map(async (each) => {
              await db
                .collection("stocks")
                .doc(eachProduct.id)
                .collection("purchasehistory")
                .doc(each.id)
                .update({
                  noofunits: eachProduct.noofunits,
                  cpperunit: eachProduct.cpperunit,
                  spperunit: eachProduct.spperunit,
                  orderid: orderId,
                });
            });
          });
      }
    });
    saveproduct();
  };

  const saveproduct = () => {
    let ordertotalvalue = 0;
    for (let i = 0; i < orderProducts.length; i++) {
      if (
        orderProducts[i]["productname"] === "" ||
        orderProducts[i]["noofunits"] === "" ||
        (orderProducts[i]["cpperunit"] === "" && orderType === "P") ||
        (orderProducts[i]["spperunit"] === "" && orderType === "S")
      ) {
        alert("Please enter all product names");
        return;
      }
      if (orderProducts[i]["cpperunit"] !== "" && orderType === "P") {
        ordertotalvalue =
          ordertotalvalue + Number(orderProducts[i]["cpperunit"]);
      }
      if (orderProducts[i]["spperunit"] !== "" && orderType === "S") {
        ordertotalvalue =
          ordertotalvalue + Number(orderProducts[i]["spperunit"]);
      }
    }
    if (orderStatus === "") {
      alert("Please select order status");
      return;
    }
    const dateTime = Date.now();
    const timestamp = Math.floor(dateTime / 1000);
    if (orderId === "new") {
      const neworderId = db.collection("orders").doc().id;
      db.collection("orders")
        .doc(neworderId)
        .set({
          status: orderStatus,
          orderproducts: orderProducts,
          ordertype: orderType,
          createdOn: timestamp,
          customername: customerName,
          customerid: customerId,
          vendorid: vendorId,
          vendorname: vendorName,
          paymentmerchantname: paymentMerchantName,
          orderdate: orderDate,
          ordervalue: Number(ordertotalvalue),
        })
        .then((product) => {
          if (orderType === "P") {
            db.collection("vendors")
              .doc(vendorId)
              .get()
              .then((custdata) => {
                let amcust = custdata.data().amount;
                let newamcst = amcust - Number(ordertotalvalue);
                db.collection("vendors")
                  .doc(vendorId)
                  .update({
                    amount: newamcst,
                  })
                  .then((done) => {
                    db.collection("vendors")
                      .doc(vendorId)
                      .collection("ledger")
                      .doc(neworderId)
                      .set({
                        type: "Order",
                        ordervalue: Number(ordertotalvalue),
                        status: orderStatus,
                        orderproducts: orderProducts,
                        ordertype: orderType,
                        createdOn: timestamp,
                        customername: customerName,
                        customerid: customerId,
                        vendorid: vendorId,
                        vendorname: vendorName,
                        paymentmerchantname: paymentMerchantName,
                        orderdate: orderDate,
                      })
                      .then((ordplaced) => {
                        alert("Order Added");

                        navigate("/orders");
                      });
                  });
              });
          } else {
            db.collection("customers")
              .doc(customerId)
              .get()
              .then((custdata) => {
                let amcust = custdata.data().amount;
                let newamcst = Number(ordertotalvalue) + amcust;
                db.collection("customers")
                  .doc(customerId)
                  .update({
                    amount: newamcst,
                  })
                  .then((done) => {
                    db.collection("customers")
                      .doc(customerId)
                      .collection("ledger")
                      .doc(neworderId)
                      .set({
                        type: "Order",
                        ordervalue: Number(ordertotalvalue),
                        status: orderStatus,
                        orderproducts: orderProducts,
                        ordertype: orderType,
                        createdOn: timestamp,
                        customername: customerName,
                        customerid: customerId,
                        vendorid: vendorId,
                        vendorname: vendorName,
                        paymentmerchantname: paymentMerchantName,
                        orderdate: orderDate,
                      })
                      .then((ordplaced) => {
                        alert("Order Added");
                        navigate("/orderssales");
                      });
                  });
              });
          }
        });
    } else {
      db.collection("orders")
        .doc(orderId)
        .update({
          status: orderStatus,
          orderproducts: orderProducts,
          ordertype: orderType,
          createdOn: timestamp,
          customername: customerName,
          customerid: customerId,
          vendorid: vendorId,
          vendorname: vendorName,
          paymentmerchantname: paymentMerchantName,
          orderdate: orderDate,
          ordervalue: Number(ordertotalvalue),
        })
        .then((product) => {
          alert("Order Updated");
          if (orderType === "P") {
            navigate("/orders");
          } else {
            navigate("/orderssales");
          }
        });
    }
  };

  const changeeachproductname = (val, ind, keyname, prodId) => {
    const newArray = [...orderProducts];
    newArray[ind][keyname] = val;
    if (keyname === "productname") {
      var id = allProducts.filter(
        (item) => `${item.name} ${item.unit}` === val
      )[0];
      newArray[ind]["id"] = id?.id;
    }
    setOrderProducts(newArray);
  };

  return (
    <div className="eachproducts">
      <LeftMenu />
      <div className="eachproductsregion">
        <h4>Enter Order Details</h4>
        <div className="upperrow">
          <div className="orderstatus">
            <h5>Order Status</h5>
            <div>
              <input
                type="radio"
                name="site_name"
                value="B"
                checked={orderStatus === "B"}
                onChange={onRadioChanged}
              />
              <h5>B</h5>
              <input
                type="radio"
                name="site_name"
                value="U"
                checked={orderStatus === "U"}
                onChange={onRadioChanged}
              />
              <h5>U</h5>
            </div>
          </div>
          <div>
            <h5>Order Type</h5>
            <select disabled>
              <option selected={orderType === ""}>-</option>
              <option selected={orderType === "P"} value="P">
                Purchase
              </option>
              <option selected={orderType === "S"} value="S">
                Sale
              </option>
            </select>
          </div>
          {orderType === "S" && (
            <div>
              <h5>Customer Name</h5>
              <select
                onChange={(e) => {
                  setCustomerName(
                    dropDownItems.filter(
                      (item) => item.id === e.target.value
                    )[0]?.name
                  );
                  setCustomerId(e.target.value);
                }}
              >
                {dropDownItems.map((eachitem) => {
                  return (
                    <option
                      value={eachitem.id}
                      selected={customerName === eachitem.name}
                    >
                      {eachitem.name}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
          <div>
            <h5>Order Date</h5>
            <input
              type="date"
              placeholder="Order Date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
            />
          </div>
          {/* </div>

        <div className="upperrow"> */}
          {orderType === "P" && (
            <div>
              <h5>Vendor Name</h5>
              <select
                onChange={(e) => {
                  setVendorName(
                    dropDownItems.filter(
                      (item) => item.id === e.target.value
                    )[0]?.name
                  );
                  setVendorId(e.target.value);
                }}
              >
                {dropDownItems.map((eachitem) => {
                  return (
                    <option
                      value={eachitem.id}
                      selected={vendorName === eachitem.name}
                    >
                      {eachitem.name}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
          {/* {orderType === "S" && (
            <div>
              <h5>Payment Merchant Name</h5>
              <input
                type="text"
                placeholder="Payment Merchant Name"
                value={paymentMerchantName}
                onChange={(e) => setPaymentMerchantName(e.target.value)}
              />
            </div>
          )} */}
          <div></div>
        </div>

        <h5>Order Products</h5>
        <div>
          <h5>Add/Decrease Products : {currentnoofproducts}</h5>
          <button
            onClick={() => setcurrentnoofproducts(currentnoofproducts + 1)}
          >
            Increase
          </button>
          <button
            onClick={() =>
              currentnoofproducts >= 1
                ? setcurrentnoofproducts(currentnoofproducts - 1)
                : ""
            }
          >
            Decrease
          </button>
        </div>
        {Array.apply(null, { length: currentnoofproducts }).map((e, i) => (
          <div className="eachproductrow">
            <div>
              <h5>Product Name</h5>
              <select
                onChange={(e) =>
                  changeeachproductname(
                    e.target.value,
                    i,
                    "productname",
                    orderProducts[i]
                  )
                }
              >
                {allProducts.map((eachitem) => {
                  return (
                    <option
                      key={eachitem.id}
                      selected={orderProducts[i]?.productname === eachitem.name}
                    >
                      {eachitem.name} {eachitem.unit}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <h5>No of units</h5>
              <input
                type="number"
                placeholder="No of units"
                value={orderProducts?.[i]?.["noofunits"] || ""}
                onChange={(e) =>
                  changeeachproductname(
                    e.target.value,
                    i,
                    "noofunits",
                    orderProducts[i]?.id
                  )
                }
              />
            </div>
            {orderType === "P" && (
              <div>
                <h5>Total Cost</h5>
                <input
                  type="number"
                  placeholder="Cost Price per unit"
                  value={orderProducts?.[i]?.["cpperunit"] || ""}
                  onChange={(e) =>
                    changeeachproductname(
                      e.target.value,
                      i,
                      "cpperunit",
                      orderProducts[i]?.id
                    )
                  }
                />
              </div>
            )}
            {orderType === "S" && (
              <div>
                <h5>Total Cost</h5>
                <input
                  type="number"
                  placeholder="Selling Price per unit"
                  value={orderProducts?.[i]?.["spperunit"] || ""}
                  onChange={(e) =>
                    changeeachproductname(
                      e.target.value,
                      i,
                      "spperunit",
                      orderProducts[i]?.id
                    )
                  }
                />
              </div>
            )}
          </div>
        ))}

        <button onClick={manintainstock}>Save</button>
      </div>
    </div>
  );
}

export default EachOrder;
