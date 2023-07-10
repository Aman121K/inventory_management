import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import db, { auth } from "../../Firebase";
import LeftMenu from "../LeftMenu/LeftMenu";
import "./EachPayment.css";

function EachPayment() {
  const { paymentID } = useParams();
  const navigate = useNavigate();

  const [orderId, setorderId] = useState("");
  const [amount, setAmount] = useState(0);
  const [paidTo, setPaidTo] = useState("");
  const [dateofpayment, setdateofpayment] = useState("");
  const [collectionMode, setCollectionMode] = useState("");

  const [allPaidTo, setAllPaidTo] = useState([]);
  const [paidToId, setPaidToId] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
      } else {
        navigate("/");
      }
    });
  }, []);

  useEffect(() => {
    db.collection("vendors")
      .get()
      .then((allven) => {
        let tmp = [];
        allven.docs.map((ven) => {
          tmp.push({ id: ven.id, data: ven.data() });
        });
        setAllPaidTo(tmp);
      });
  }, []);

  useEffect(() => {
    if (paymentID !== "new") {
      db.collection("payments")
        .doc(paymentID)
        .get()
        .then((payment) => {
          setorderId(payment.data().orderid);
          setAmount(payment.data().amount);
          setPaidTo(payment.data().paidto);
          setPaidToId(payment.data().paidtoid);
          setdateofpayment(payment.data().dateofpayment);
          setCollectionMode(payment.data().paymentmode);
        });
    }
  }, []);

  const onRadioChanged = (e) => {
    setCollectionMode(e.target.value);
  };

  const savepayment = () => {
    const dateTime = Date.now();
    const timestamp = Math.floor(dateTime / 1000);
    const paidtoperson = allPaidTo.filter((per) => per.id === paidToId)[0]?.data
      ?.name;
    console.log(paidtoperson);
    if (paymentID === "new") {
      const newProdId = db.collection("payments").doc().id;
      db.collection("payments")
        .doc(newProdId)
        .set({
          orderid: orderId,
          amount: amount,
          paidto: paidtoperson,
          paidtoid: paidToId,
          createdOn: timestamp,
          dateofpayment: dateofpayment,
          paymentmode: collectionMode,
        })
        .then((product) => {
          db.collection("vendors")
            .doc(paidToId)
            .get()
            .then((custdata) => {
              let amcust = custdata.data().amount;
              let newamcst = amcust + amount;
              db.collection("vendors")
                .doc(paidToId)
                .update({
                  amount: newamcst,
                })
                .then((done) => {
                  db.collection("vendors")
                    .doc(paidToId)
                    .collection("ledger")
                    .doc(newProdId)
                    .set({
                      type: "Payment",
                      ordervalue: amount,
                      createdOn: timestamp,
                      orderid: orderId,
                      collectedfrom: paidtoperson,
                      paidtoid: paidToId,
                      dateofpayment: dateofpayment,
                      paymentmode: collectionMode,
                    })
                    .then((ordplaced) => {
                      alert("Payment Added");
                    });
                });
            });
        });
    } else {
      db.collection("payments")
        .doc(paymentID)
        .update({
          orderid: orderId,
          amount: amount,
          paidto: paidtoperson,
          paidtoid: paidToId,
          dateofpayment: dateofpayment,
          paymentmode: collectionMode,
        })
        .then((product) => {
          alert("Payment Updated");
        });
    }
  };
  return (
    <div className="eachpayment">
      <LeftMenu />
      <div className="eachpaymentregion">
        <h5>Payment Done on</h5>
        <input
          type="date"
          placeholder="Enter date of payment"
          value={dateofpayment}
          onChange={(e) => setdateofpayment(e.target.value)}
        />
        <h4>Enter Payment Details</h4>
        <h5>Order ID</h5>
        <input
          type="text"
          placeholder="Order ID"
          value={orderId}
          onChange={(e) => setorderId(e.target.value)}
        />
        <h5>Payment Mode</h5>
        <div className="radios">
          <input
            type="radio"
            name="site_name"
            value="Bank"
            checked={collectionMode === "Bank"}
            onChange={onRadioChanged}
          />
          <h5>Bank</h5>
          <input
            type="radio"
            name="site_name"
            value="Cash"
            checked={collectionMode === "Cash"}
            onChange={onRadioChanged}
          />
          <h5>Cash</h5>
        </div>
        <h5>Amount</h5>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div>
          <h5>Paid To</h5>

          <select
            onChange={(e) => {
              setPaidToId(e.target.value);
            }}
          >
            <option selected={paidTo === "" || paidTo === "-"}>-</option>
            {allPaidTo.map((eachitem) => {
              return (
                <option
                  value={eachitem.id}
                  selected={paidTo === eachitem?.data?.name}
                >
                  {eachitem?.data?.name}
                </option>
              );
            })}
          </select>
        </div>
        <button onClick={savepayment}>Save</button>
      </div>
    </div>
  );
}

export default EachPayment;
