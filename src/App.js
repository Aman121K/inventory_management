import logo from "./logo.svg";
import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import Products from "./components/Products/Products";
import Orders from "./components/Orders/Orders";
import EachProduct from "./components/EachProduct/EachProduct";
import EachOrder from "./components/EachOrder/EachOrder";
import Payments from "./components/Payments/Payments";
import EachPayment from "./components/EachPayment/EachPayment";
import Collections from "./components/Collections/Collections";
import EachCollection from "./components/EachCollection/EachCollection";
import Customers from "./components/Customers/Customers";
import Vendors from "./components/Vendors/Vendors";
import EachCustomer from "./components/EachCustomer/EachCustomer";
import EachVendor from "./components/EachVendor/EachVendor";
import Ledger from "./components/Ledger/Ledger";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Login />} />
        </Routes>
        <Routes>
          <Route exact path="/home" element={<Home />} />
        </Routes>
        <Routes>
          <Route exact path="/products" element={<Products />} />
        </Routes>
        <Routes>
          <Route exact path="/payments" element={<Payments />} />
        </Routes>
        <Routes>
          <Route exact path="/collections" element={<Collections />} />
        </Routes>
        <Routes>
          <Route exact path="/orders" element={<Orders type="P" />} />
        </Routes>
        <Routes>
          <Route exact path="/orderssales" element={<Orders type="S" />} />
        </Routes>
        <Routes>
          <Route exact path="/product/:productId" element={<EachProduct />} />
        </Routes>
        <Routes>
          <Route exact path="/payment/:paymentID" element={<EachPayment />} />
        </Routes>
        <Routes>
          <Route
            exact
            path="/collection/:paymentID"
            element={<EachCollection />}
          />
        </Routes>
        <Routes>
          <Route
            exact
            path="/order/:orderId/:orderType"
            element={<EachOrder />}
          />
        </Routes>
        <Routes>
          <Route exact path="/ledger/:type/:personId" element={<Ledger />} />
        </Routes>
        <Routes>
          <Route exact path="/customers" element={<Customers />} />
        </Routes>
        <Routes>
          <Route exact path="/vendors" element={<Vendors />} />
        </Routes>
        <Routes>
          <Route exact path="/customer/:productId" element={<EachCustomer />} />
        </Routes>
        <Routes>
          <Route exact path="/vendor/:productId" element={<EachVendor />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
