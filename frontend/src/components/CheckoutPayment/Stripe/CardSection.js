import React from 'react';
import {CardElement,CardNumberElement,CardExpiryElement,CardCvcElement} from '@stripe/react-stripe-js';
import '../Stripe/CardSectionStyles.css';
import i18next from "i18next";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Row,
    Col,
    Container
} from "reactstrap";

// for redux
import {bindActionCreators} from "redux";
import {ActCreators} from "../../../redux/bindActionCreator";
import {connect} from "react-redux";

let userData = {};
let orderDetails={};
let client_secret=null;
let stripeUserId=null;

const mapStateToProps = state => {
    userData= state.userData;
    orderDetails=state.orderDetails;
    client_secret=state.client_secret;
    stripeUserId=state.stripeUserId;
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators(ActCreators, dispatch)
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

function CardSection() {
  console.log("orderDetail ",orderDetails)
  return (
      <>
        <Row>
            <Col md={12} lg={12} xs={12} xl={12}>
              <label>
                {i18next.t("Amount")}
              </label>
              <h2>
                {orderDetails.net_value}
              </h2>
            </Col>
            <Col md={12} lg={12} xs={12} xl={12}>
            <label>
                {i18next.t("Card details")}
            </label>
            
            <CardElement options={CARD_ELEMENT_OPTIONS} />

            {/* <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
            <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
            <CardCvcElement options={CARD_ELEMENT_OPTIONS} />  */}
            </Col>
        </Row>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps) (CardSection);
