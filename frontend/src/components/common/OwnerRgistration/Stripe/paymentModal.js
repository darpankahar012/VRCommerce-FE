import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { loadStripe } from "@stripe/stripe-js";

import React, { Component } from "react";
import axios from "axios";
//reactstrap
import {
  Button,
  Modal,
  FormGroup,
  Input,
  Card,
  CardBody,
  Label,
} from "reactstrap";

// For Notification
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import i18next from "i18next";

//Phone Number Input
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";

// For Redux Data
import { bindActionCreators } from "redux";
import { ActCreators } from "../../../../redux/bindActionCreator";
import { connect } from "react-redux";

import instance from "../../../../axios";
import requests from "../../../../requests";

import { Link } from "react-router-dom";
import { Dropdown } from "semantic-ui-react";

import CheckoutForm from "../Stripe/CheckoutForm";

let userData = {};

const mapStateToProps = (state) => {
  userData = state.userData;
};

const pkKey = "pk_test_ZJFOPhWsvYWwsLV689iOI5WZ00JAqSFB7E";

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};

export class PaymentModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps() {
    console.log(" data recived", this.props);
  }

  componentDidMount = async () => {
    console.log(" ====>", this.props);
  };

  handleSelectChange = (e, data) => {
    this.setState({
      [data.name]: data.value,
    });
  };

  oncloseModal = () => {
    this.props.onClose();
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    return (
      <>
        <Modal className="modal-dialog-centered" isOpen={this.props.show}>
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {i18next.t("Subscribe Your Plan...")}
            </h5>
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={this.oncloseModal}
            >
              <span aria-hidden={true}>×</span>
            </button>
          </div>
          <div className="modal-body p-0">
            <Card className="bg-secondary shadow border-0">
              <CardBody className="p-lg-5">
                <FormGroup>
                  <Elements stripe={loadStripe(pkKey)}>
                    <CheckoutForm
                      update={this.props.update}
                      userData={this.props}
                    />
                  </Elements>
                </FormGroup>
              </CardBody>
            </Card>
          </div>
          <NotificationContainer />
        </Modal>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentModal);
