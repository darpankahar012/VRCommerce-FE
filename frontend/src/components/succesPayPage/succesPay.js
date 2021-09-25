import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./succesPage.scss";
// reactstrap components
import {
  Button,
  NavbarBrand,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  CardTitle,
} from "reactstrap";

const SuccesPaymentPage = (props) => {
  const redirectToLogin = () => {
    props.history.push({
      pathname: "/",
    });
  };
  return (
    <>
      <div id="succesPaymentPage">
        <div className="mainContent">
          <div className="imageSec">
            <img
              className="succesImage"
              alt="..."
              src={require("../../../src/assets/img/brand/success.png")}
            />
          </div>
          <div className="mainHeader">
            Thank you , your payment successfully done , you have successfully
            subscribed this plan, you can login from here and enjoy the
            platform.
          </div>
          <div className="loginBtn">
            <Button onClick={(e) => redirectToLogin(e)} color="primary">
              {" "}
              Login
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuccesPaymentPage;
