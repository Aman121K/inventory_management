import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../Firebase";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const logintapped = () => {
    if (email === "" || password === "") {
      alert("Please enter Email and Password");
    } else {
      auth
        .signInWithEmailAndPassword(email, password)
        .then((user) => {
          navigate("/home");
        })
        .catch((err) => {
          alert("Login Failed");
        });
    }
  };

  return (
    <div className="loginregion">
      <div className="logininnerregion">
        <h3>Login to your account</h3>
        <form onSubmit={(e) => e.preventDefault()}>
          <h5>Email</h5>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <h5>Password</h5>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input type="submit" onClick={logintapped} value="Login" />
        </form>
      </div>
    </div>
  );
}

export default Login;
