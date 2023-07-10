import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import db, { auth } from "../../Firebase";
import LeftMenu from "../LeftMenu/LeftMenu";
import "./EachCollection.css";

function EachCollection() {
  const { paymentID } = useParams();
  const navigate = useNavigate();

  const [orderId, setorderId] = useState("");
  const [amount, setAmount] = useState(0);
  const [collectedFrom, setCollectedFrom] = useState("");
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
    db.collection("customers")
      .get()
      .then((allven) => {
        let tmp = [];
        allven.docs.map((ven) => {
          tmp.push({ id: ven.id, data: ven.data() });
        });
        console.log(tmp);
        setAllPaidTo(tmp);
      });
  }, []);

  useEffect(() => {
    if (paymentID !== "new") {
      db.collection("collections")
        .doc(paymentID)
        .get()
        .then((payment) => {
          setorderId(payment.data().orderid);
          setAmount(payment.data().amount);
          setCollectedFrom(payment.data().collectedfrom);
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
    const paidtoperson = allPaidTo.filter((per) => per.id === collectedFrom)[0]
      ?.data?.name;
    if (paymentID === "new") {
      const newProdId = db.collection("collections").doc().id;
      db.collection("collections")
        .doc(newProdId)
        .set({
          orderid: orderId,
          amount: amount,
          collectedfrom: paidtoperson,
          paidtoid: collectedFrom,
          createdOn: timestamp,
          dateofpayment: dateofpayment,
          paymentmode: collectionMode,
        })
        .then((product) => {
          console.log("Here");
          db.collection("customers")
            .doc(collectedFrom)
            .get()
            .then((custdata) => {
              let amcust = custdata.data().amount;
              let newamcst = amcust - amount;
              db.collection("customers")
                .doc(collectedFrom)
                .update({
                  amount: newamcst,
                })
                .then((done) => {
                  db.collection("customers")
                    .doc(collectedFrom)
                    .collection("ledger")
                    .doc(newProdId)
                    .set({
                      type: "Collection",
                      ordervalue: amount,
                      createdOn: timestamp,
                      orderid: orderId,
                      collectedfrom: paidtoperson,
                      paidtoid: collectedFrom,
                      dateofpayment: dateofpayment,
                      paymentmode: collectionMode,
                    })
                    .then((ordplaced) => {
                      alert("Collection Added");
                    });
                });
            });
        });
    } else {
      db.collection("collections")
        .doc(paymentID)
        .update({
          orderid: orderId,
          amount: amount,
          collectedfrom: paidtoperson,
          paidtoid: collectedFrom,
          dateofpayment: dateofpayment,
          paymentmode: collectionMode,
        })
        .then((product) => {
          alert("Collection Updated");
        });
    }
  };
  return (
    <div className="eachpayment">
      <LeftMenu />
      <div className="eachpaymentregion">
        <h4>Enter Collection Details</h4>
        <h5>Collection Done on</h5>
        <input
          type="date"
          placeholder="Enter date of collection"
          value={dateofpayment}
          onChange={(e) => setdateofpayment(e.target.value)}
        />
        <h5>Collection Mode</h5>
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
        <h5>Order ID</h5>
        <input
          type="text"
          placeholder="Order ID"
          value={orderId}
          onChange={(e) => setorderId(e.target.value)}
        />
        <h5>Amount</h5>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div>
          <h5>Collected From</h5>
          <select onChange={(e) => setCollectedFrom(e.target.value)}>
            <option selected={collectedFrom === "" || collectedFrom === "-"}>
              -
            </option>
            {allPaidTo?.map((eachitem) => {
              return (
                <option
                  value={eachitem.id}
                  selected={collectedFrom === eachitem?.data?.name}
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

export default EachCollection;
