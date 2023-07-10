import React, { useState, useEffect } from "react";
import db from "../../Firebase";
import LeftMenu from "../LeftMenu/LeftMenu";
import "./Home.css";

function Home() {
  const [timeselected, settimeselected] = useState("1 Day");
  const [timevalue, setTimeValue] = useState(1);
  const [allOrders, setAllOrders] = useState([]);
  let allProducts = new Map();
  const [maxproductsold, setmaxproductsold] = useState({});
  const [minproductsold, setminproductsold] = useState({});
  const [productssold, setproductssold] = useState(0);

  const dateTime = Date.now();
  const timestamp = Math.floor(dateTime / 1000);

  useEffect(() => {
    db.collection("orders")
      .get()
      .then((allorders) => {
        var tmp = [];
        allorders.docs.map((order) => {
          tmp.push({ id: order.id, ...order.data() });
        });
        console.log(tmp);
        setAllOrders(tmp);
      });
  }, []);

  useEffect(() => {
    fetchinfo();
  }, [allOrders, timeselected]);

  const fetchinfo = () => {
    var maxunit = 0;
    var minunit = 0;
    var maxid = {};
    var minid = {};
    allOrders.forEach((order) => {
      if (order.createdOn >= timestamp - Number(timevalue) * 24 * 60 * 60) {
        setproductssold((productssold) => {
          return productssold + order.orderproducts?.length;
        });
        order.orderproducts.forEach((newprod) => {
          if (newprod.noofunits > maxunit) {
            maxunit = newprod.noofunits;
            maxid = newprod;
          }
          minunit = maxunit;
          if (newprod.noofunits <= minunit) {
            minunit = newprod.noofunits;
            minid = newprod;
          }
          if (allProducts.has(newprod?.id)) {
            allProducts[newprod.id].cpperunit += Number(
              newprod.cpperunit || "0"
            );
            allProducts[newprod.id].noofunits += Number(
              newprod.noofunits || "0"
            );
            allProducts[newprod.id].spperunit += Number(
              newprod.spperunit || "0"
            );
          } else {
            allProducts[newprod.id] = {
              cpperunit: Number(newprod.cpperunit || "0"),
              noofunits: Number(newprod.noofunits || "0"),
              spperunit: Number(newprod.spperunit || "0"),
            };
          }
        });
      }
    });
    setmaxproductsold(maxid);
    setminproductsold(minid);
    console.log("Reaching here");
    console.log(maxid);
    console.log(minid);
  };
  return (
    <div className="home">
      <LeftMenu active="home" />
      <div className="homeregion">
        <div className="top">
          <button
            onClick={() => {
              settimeselected("1 Day");
              setTimeValue(1);
            }}
            className={timeselected === "1 Day" ? "active" : ""}
          >
            1 Day
          </button>
          <button
            onClick={() => {
              settimeselected("1 Week");
              setTimeValue(7);
            }}
            className={timeselected === "1 Week" ? "active" : ""}
          >
            1 Week
          </button>
          <button
            onClick={() => {
              settimeselected("1 Month");
              setTimeValue(30);
            }}
            className={timeselected === "1 Month" ? "active" : ""}
          >
            1 Month
          </button>
          <button
            onClick={() => {
              settimeselected("1 Year");
              setTimeValue(365);
            }}
            className={timeselected === "1 Year" ? "active" : ""}
          >
            1 Year
          </button>
        </div>
        <div className="bottom">
          <div className="bubblerow">
            <div className="bubble">
              <h4>No of purchase orders in {timeselected}</h4>
              <h3>
                {
                  allOrders.filter(
                    (order) =>
                      order.createdOn > timestamp - timevalue * 24 * 60 * 60 &&
                      order.ordertype === "P"
                  ).length
                }
              </h3>
            </div>

            <div className="bubble">
              <h4>No of sales orders in {timeselected}</h4>
              <h3>
                {
                  allOrders.filter(
                    (order) =>
                      order.createdOn > timestamp - timevalue * 24 * 60 * 60 &&
                      order.ordertype === "S"
                  ).length
                }
              </h3>
            </div>

            <div className="bubble">
              <h4>Total Sales in {timeselected}</h4>
              <h3>
                {allOrders
                  .filter(
                    (order) =>
                      order.createdOn > timestamp - timevalue * 24 * 60 * 60 &&
                      order.ordertype === "S"
                  )
                  .reduce(function (acc, obj) {
                    return acc + obj.ordervalue || 0;
                  }, 0)}
              </h3>
            </div>

            {/* <div className="bubble">
              <h4>No of total orders in {timeselected}</h4>
              <h3>
                {
                  allOrders.filter(
                    (order) =>
                      order.createdOn > timestamp - timevalue * 24 * 60 * 60
                  ).length
                }
              </h3>
            </div> */}
          </div>

          <div className="bubblerow">
            <div className="bubble">
              <h4>Total Purchases in {timeselected}</h4>
              <h3>
                {allOrders
                  .filter(
                    (order) =>
                      order.createdOn > timestamp - timevalue * 24 * 60 * 60 &&
                      order.ordertype === "P"
                  )
                  .reduce(function (acc, obj) {
                    return acc + obj.ordervalue || 0;
                  }, 0)}
              </h3>
            </div>

            <div className="bubble">
              <h4>Net Receivable in {timeselected}</h4>
              <h3></h3>
            </div>

            <div className="bubble">
              <h4>Net Payables in {timeselected}</h4>
              <h3></h3>
            </div>
          </div>

          <div className="bubblerow">
            <div className="bubble">
              <h4>Product sold the most in {timeselected}</h4>
              <h3>{maxproductsold?.productname}</h3>
            </div>

            {/* <div className="bubble">
              <h4>No of products sold in {timeselected}</h4>
              <h3>{productssold}</h3>
            </div>

            <div className="bubble">
              <h4>Maximum sale of product in {timeselected}</h4>
              <h3>
                {maxproductsold.productname}, Qty:
                {maxproductsold.noofunits}
              </h3>
            </div> */}

            {/* <div className="bubble">
              <h4>Maximum sale amount of product in {timeselected}</h4>
              <h3>
                {minproductsold.productname}, Qty:
                {minproductsold.noofunits}
              </h3>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
