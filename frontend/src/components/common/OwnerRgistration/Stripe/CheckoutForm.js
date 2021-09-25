import React from "react";
import { ElementsConsumer, CardElement } from "@stripe/react-stripe-js";
import i18next from "i18next";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Label,
  Button,
  FormGroup,
  Input,
  InputGroup,
  Modal,
  Alert,
} from "reactstrap";

import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import { mainUrl } from "../../../common/constant/constant";

// for redux
import { bindActionCreators } from "redux";
import { ActCreators } from "../../../../redux/bindActionCreator";
import { connect } from "react-redux";

import { Link, Redirect } from "react-router-dom";

import instance from "../../../../axios";
import requests from "../../../../requests";

let userData = {};
let selectedPlan = {};
let registerTimeData = {};
let token = null;

const mapStateToProps = (state) => {
  userData = state.userData;
  selectedPlan = state.selectedPlan;
  registerTimeData = state.registerTimeUserData;
  token = state.token;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};

class CheckoutForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      SubscriptionStatus: false,
      visible: false,
      countryData: {},
    };
  }
  onDismiss = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };

  componentWillReceiveProps() {
    console.log(" data recived in checkOut", this.props);
  }

  componentDidMount = () => {
    this.getIpDetail();
  };

  getIpDetail = () => {
    fetch("http://ip-api.com/json", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.text())
      .then((responseText) => {
        responseText = JSON.parse(responseText);
        console.log(" data ", responseText);
        this.setState({
          countryData: responseText,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  registerUser = () => {
    let createCustomerData = {
      company: registerTimeData.companyName,
      name: registerTimeData.ownerName,
      email: registerTimeData.ownerEmail,
      addressLine: this.state.countryData.city,
      postal_code: this.state.countryData.zip,
      city: this.state.countryData.city,
      country: this.state.countryData.country,
    };
    console.log("createCustomerData", createCustomerData);

    fetch(mainUrl + "api/subscription/stripe/customer", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createCustomerData),
    })
      .then((response) => response.text())
      .then((responseText) => {
        responseText = JSON.parse(responseText);
        console.log("created cudtomer", responseText);
        let customerId = responseText.data.id;
        console.log("customerId ==>", customerId);
        this.createPaymentMethod(customerId);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  createPaymentMethod = async (customerId) => {
    const { stripe, elements } = this.props;

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        name: registerTimeData.ownerName,
      },
    });
    if (error) {
      console.log("error", error);
      return;
    } else {
      console.log("[PaymentMethod]", paymentMethod);
      let paymentMethodId = paymentMethod.id;
      console.log("paymentMethodId", paymentMethodId);
      this.createSubscption(paymentMethodId, customerId);
    }
  };

  createSubscption = (paymentMethodId, customerId) => {
    let data2 = {
      customerId: customerId,
      priceId: selectedPlan.priceId,
      paymentId: paymentMethodId,
      trialDays: "1",
    };

    fetch(mainUrl + "api/subscription/stripe", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data2),
    })
      .then((response) => response.text())
      .then((responseText) => {
        responseText = JSON.parse(responseText);
        console.log("created subscription", responseText);

        let subScptionId = responseText.data.subscription.id;
        let cusId = customerId;
        let expiredAt =
          responseText.data.subscription.latest_invoice.lines.data[0].period
            .end;

        this.register(subScptionId, cusId, expiredAt);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  register = (subscprtionId, customerId, expiredAt) => {
    let data = {
      name: registerTimeData.ownerName,
      email: registerTimeData.ownerEmail,
      password: registerTimeData.password,
      phone: registerTimeData.ownerPhone,
      country: this.state.countryData.country,
      subscription: subscprtionId,
      plan: selectedPlan.priceId,
      customerId: customerId,
      expiredAt: expiredAt,
    };
    console.log({ data });
    fetch(mainUrl + "api/auth/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.text())
      .then((responseText) => {
        responseText = JSON.parse(responseText);
        console.log("register customer", responseText);
        if (responseText.error) {
          console.log("responseText.error", responseText.error);
          return false;
        } else {
          console.log("responseText.error", responseText.data);
          NotificationManager.success("Register Successfully");

          if (responseText.data) {
            return <Redirect to="/succes" />;
          }
        }
      })
      .catch((err) => {
        console.log(err);
        // NotificationManager.error("Something went wrong");
      });
  };

  // handleSubmit = async (event) => {
  //   // Block native form submission.
  //   event.preventDefault();

  //   const { stripe, elements } = this.props;

  //   if (!stripe || !elements) {
  //     // Stripe.js has not loaded yet. Make sure to disable
  //     // form submission until Stripe.js has loaded.
  //     return;
  //   }

  //   // Get a reference to a mounted CardElement. Elements knows how
  //   // to find your CardElement because there can only ever be one of
  //   // each type of element.
  //   const cardElement = elements.getElement(CardElement);

  //   const { error, paymentMethod } = await stripe.createPaymentMethod({
  //     type: "card",
  //     card: cardElement,
  //     billing_details: {
  //       name: `${userData.name}`,
  //       email: `${userData.email}`,
  //     },
  //   });

  //   if (error) {
  //     console.log("[error]", error);
  //   } else {
  //     console.log("[PaymentMethod]", paymentMethod);
  //     const paymentMethodId = paymentMethod.id;
  //     this.createSubscription(paymentMethodId);
  //   }
  // };

  // createSubscription = async (paymentMethodId) => {
  //   let requestBody = {
  //     plan_id: selectedPlan._id,
  //     customer: userData.stripe_customer.id,
  //     paymentMethodId: paymentMethodId,
  //     price: selectedPlan.priceId,
  //     trial_days: "1",
  //   };
  //   console.log("Body == ", requestBody);
  //   const response = await instance
  //     .post(requests.fetchSubscribePlan, requestBody, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .catch((error) => {
  //       console.log("Response => ", error);
  //       let errorMessage = error.message;
  //       NotificationManager.error(errorMessage);
  //     });
  //   if (response && response.data) {
  //     console.log("Response Plan ==> ", response.data.data);
  //     this.setState({
  //       SubscriptionStatus: true,
  //     });
  //   }
  // };

  render() {
    const { stripe } = this.props;
    console.log(" data of user", this.props);
    const { SubscriptionStatus } = this.state;
    console.log("Selected Plan Info ==> ", selectedPlan);
    console.log("registerTimeData ==> ", registerTimeData);

    console.log("Registration Token ==> ", token);
    // if (SubscriptionStatus) {
    //   return <Redirect to="/index" />;
    // }
    return (
      <>
        {
          <form>
            <Card className="bg-secondary shadow border-0">
              <CardBody className="p-lg-5">
                <FormGroup>
                  <Label>Your subscription will start now...</Label>
                </FormGroup>
                <FormGroup>
                  <div className="display-3">{selectedPlan.name}</div>
                  <div className="display-4">
                    Total Due Amount: <br />
                    {selectedPlan.amount} / {selectedPlan.duration}
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label for="Name">Enter your card details</Label>
                </FormGroup>
                <FormGroup>
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424770",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                        },
                        invalid: {
                          color: "#9e2146",
                        },
                      },
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <button
                    className="btn btn-outline-success btn-lg"
                    type="submit"
                    disabled={!stripe}
                    onClick={() => {
                      this.registerUser();
                    }}
                  >
                    Subscribe Now
                  </button>
                </FormGroup>
              </CardBody>
            </Card>
          </form>
        }
      </>
    );
  }
}

function InjectedCheckoutForm() {
  return (
    <ElementsConsumer>
      {({ stripe, elements }) => (
        <CheckoutForm stripe={stripe} elements={elements} />
      )}
    </ElementsConsumer>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InjectedCheckoutForm);
