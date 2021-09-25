import React from "react";
import axios from "axios";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

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
  Form,
  Input,
} from "reactstrap";
import ReactDatetime from "react-datetime";
import HomeHeader from "../header/HomeHeader";
import instance from "../../../axios";
import requests from "../../../requests";
import StripePlans from "../OwnerRgistration/StripePlan";

//for Redux
import { bindActionCreators } from "redux";
import { ActCreators } from "../../../redux/bindActionCreator";
import { connect } from "react-redux";

//Phone Number Input
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import i18next from "i18next";

import "./register.scss";

import Loader from "../../common/Loader";

let userData = {};

const mapStateToProps = (state) => {
  userData = state.userData;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};

class ResturantRegistration extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 1,
      companyName: "",
      ownerName: "",
      ownerEmail: "",

      passoword: "",
      confirmPassword: "",

      ownerPhone: "",
      dial_code: null,
      country_name: "",
      country_code: "",

      currencies: {},
      languages: [],

      countries: [],
      LoaderShow: true,
      userData: {},
    };
  }

  handleChangeForPhone = (value, data, event, formattedValue) => {
    this.setState({
      ownerPhone: formattedValue,
      dial_code: data.dialCode,
      country_name: data.name,
      country_code: data.countryCode,
    });
  };

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  getCountryCode = async () => {
    const response = await instance
      .get(requests.fetchCountryCode)
      .catch((error) => {
        let errorMessage = error.message;
        NotificationManager.error(errorMessage);
      });
    if (response && response.data) {
      console.log("Response Country Code => ", response.data.data);
      this.setState(
        {
          countries: response.data.data,
        },
        () => {
          this.setState({ LoaderShow: false });
        }
      );
    }
  };

  componentDidMount = async () => {
    this.getCountryCode();
  };

  nextStep = () => {
    let userData = this.state;
    console.log("userData", userData);
    this.props.REGISTER_TIME_USER_DATA(userData);
    this.setState({
      activeIndex: 2,
      userData: userData,
    });
  };

  onRegisterResturant = async () => {
    this.setState({ LoaderShow: true });
    axios
      .get(
        "https://restcountries.eu/rest/v2/callingcode/" +
          this.state.dial_code +
          "?fields=name;callingCodes;languages;currencies"
      )
      .then((response) => {
        this.setState(
          {
            currencies: response.data[0].currencies[0],
            languages: response.data[0].languages,
          },
          async () => {
            let currencies = {
              code: this.state.currencies.code.toLowerCase(),
              curr_name: this.state.currencies.name,
              symbol: this.state.currencies.symbol,
            };
            let registerResturatData = {
              company_Name: this.state.companyName,
              name: this.state.ownerName,
              email: this.state.ownerEmail,
              phone: this.state.ownerPhone,
              password: this.state.password,
              userType: "owner",
              country_name: this.state.country_name,
              country_code: this.state.country_code,
              currencies: currencies,
              user_languages: this.state.languages,
              dial_code: this.state.dial_code,
            };
            const response = await instance
              .post(requests.fetchRestuarantRegistration, registerResturatData)
              .catch((error) => {
                let errorMessage = error.message;
                NotificationManager.error(errorMessage);
              });
            if (response && response.data) {
              console.log("Response => ", response.data.data.user);
              let userdata = response.data.data.user;
              this.props.LOGIN_USER_DETAIL(userdata);
              let token = response.data.data.token;
              this.props.TOKEN_KEY(token);
              this.setState({ LoaderShow: false });

              const { history } = this.props;
              if (history) {
                history.push("/plans");
              }
            }
          }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    let {
      companyName,
      ownerName,
      ownerEmail,
      ownerPhone,
      passoword,
      confirmPassword,
      countries,
    } = this.state;
    return (
      <>
        <HomeHeader />

        {this.state.activeIndex === 1 && (
          <div className="main-content" ref="mainContent">
            <div
              className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
              style={{
                minHeight: "450px",
                backgroundImage:
                  "url(" + require("assets/img/theme/Food-2.png") + ")",
                backgroundSize: "cover",
                backgroundPosition: "center top",
              }}
            >
              <Container className="d-flex align-items-center">
                <Row>
                  <Col lg="7" md="10">
                    <h3 className="display-3 text-white"></h3>
                  </Col>
                </Row>
              </Container>
            </div>
            <Container className="mt--7">
              <Loader open={this.state.LoaderShow} />
              <Row>
                <Col className="col">
                  <Card className="bg-secondary shadow">
                    <CardHeader className="border-0">
                      <div className="d-flex justify-content-between">
                        <div className="md-7">
                          <h1 className="mb-0">
                            {i18next.t("Register your company")}
                          </h1>
                        </div>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <Form>
                        <h6 className="heading-small text-muted mb-4">
                          {i18next.t("COMPANY INFORMATION")}
                        </h6>
                        <div className="pl-lg-4">
                          <Row>
                            <Col md="12">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-address"
                                >
                                  {i18next.t("Company Name")}
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  placeholder={i18next.t("Company Name")}
                                  type="text"
                                  name="companyName"
                                  value={this.state.companyName}
                                  onChange={(e) => this.handleChange(e)}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </div>
                        <hr className="my-4" />
                        {/* Address */}
                        <h6 className="heading-small text-muted mb-4">
                          {i18next.t("CONTACT INFORMATION")}
                        </h6>
                        <div className="pl-lg-4">
                          <Row>
                            <Col md="12">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-address"
                                >
                                  {i18next.t("Owner Name")}
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  placeholder={i18next.t("Owner Name")}
                                  type="text"
                                  name="ownerName"
                                  value={this.state.ownerName}
                                  onChange={(e) => this.handleChange(e)}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col md="12">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-address"
                                >
                                  {i18next.t("Owner Email")}
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  placeholder={i18next.t("Owner Email")}
                                  type="email"
                                  name="ownerEmail"
                                  value={this.state.ownerEmail}
                                  onChange={(e) => this.handleChange(e)}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col md="12">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-address"
                                >
                                  {i18next.t("Password")}
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  placeholder={i18next.t("Password")}
                                  type="password"
                                  name="password"
                                  value={this.state.password}
                                  onChange={(e) => this.handleChange(e)}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col md="12">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-address"
                                >
                                  {i18next.t("Confirm Password")}
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  placeholder={i18next.t("Confirm Password")}
                                  type="password"
                                  name="confirmPassword"
                                  value={this.state.confirmPassword}
                                  onChange={(e) => this.handleChange(e)}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          {countries.length > 0 && (
                            <Row>
                              <Col md="12">
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-address"
                                  >
                                    {i18next.t("Owner Phone")}
                                  </label>

                                  <PhoneInput
                                    inputProps={{
                                      name: "Phno",
                                      required: true,
                                      autoFocus: true,
                                    }}
                                    // onlyCountries={countries}
                                    placeholder={i18next.t("Enter Phone no")}
                                    country={"in"}
                                    inputStyle={{ width: "100%" }}
                                    value={this.state.ownerPhone}
                                    autoFormat={false}
                                    onChange={(
                                      value,
                                      data,
                                      event,
                                      formattedValue
                                    ) =>
                                      this.handleChangeForPhone(
                                        value,
                                        data,
                                        event,
                                        formattedValue
                                      )
                                    }
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                          )}
                        </div>
                        <center>
                          <Button
                            className="my-4"
                            color="success"
                            type="button"
                            onClick={() => this.props.history.push("/")}
                          >
                            {i18next.t("Back to Login")}
                          </Button>
                          <Button
                            className="my-4"
                            color="success"
                            disabled={
                              !companyName ||
                              !ownerName ||
                              !ownerEmail ||
                              !ownerPhone
                                ? true
                                : false
                            }
                            type="button"
                            // onClick={() => this.onRegisterResturant()}
                            onClick={() => this.nextStep()}
                          >
                            {i18next.t("save")}
                          </Button>
                        </center>
                      </Form>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
            <NotificationContainer />
          </div>
        )}
        {this.state.activeIndex === 2 && (
          <>
            <StripePlans userData={this.state.userData} />
          </>
        )}
        {this.state.activeIndex === 2 && (
          <>
            <div className="backBtn">
              <Button
                color="primary"
                onClick={() => {
                  this.setState({
                    activeIndex: 1,
                  });
                }}
              >
                Back
              </Button>
            </div>
          </>
        )}
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResturantRegistration);
