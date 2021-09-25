import React from "react";
// react component that copies the given text inside your clipboard
import { CopyToClipboard } from "react-copy-to-clipboard";
// reactstrap components

import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  FormGroup,
  Form,
  Input,
  Alert,
  Label,
  CardTitle,
  CardText,
} from "reactstrap";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import ReactDatetime from "react-datetime";
import { bindActionCreators } from "redux";
import { ActCreators } from "../../redux/bindActionCreator";
import { connect } from "react-redux";
import instance from "../../axios";
import requests from "../../requests";
import { mainUrl } from "../../components/common/constant/constant";
import StripePlan from "../common/OwnerRgistration/StripePlan";

// core components
import Header from "components/Headers/Header.js";
import { Route, Switch, Redirect } from "react-router-dom";
// reactstrap components
// core components
import Navbar from "../Navbars/AdminNavbar";
import AdminFooter from "../Footers/AdminFooter.js";
import Sidebar from "../Sidebar/Sidebar.js";

import adminRoutes from "../../routes";
import ownerRoutes from "../../ownerRoutes";
import driverRoutes from "../../driverRouts";
import { clientsRoutes } from "../../clientRouts";

// Axios
import axios from "axios";

//Phone Number Input
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";

import i18next from "i18next";

// import routes from "../../../routes.js";

import "../Dashboard/Pages/Details.css";
import AlertSuccess from "../Dashboard/Pages/alertBox";

import Loader from "../common/Loader";

let userData = {};
let token = null;

const mapStateToProps = (state) => {
  userData = state.userData;
  token = state.token;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};
class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showPlans: false,
      planTitle: "",
      planStartDate: "",
      plaEndDate: "",
      planAmount: "",
      planStatus: "",

      name: userData.hasOwnProperty("name") ? userData.name : "",
      email: userData.hasOwnProperty("email") ? userData.email : "",
      phone: userData.hasOwnProperty("phone") ? userData.phone : "",
      address: userData.hasOwnProperty("address")
        ? userData.address.length > 0
          ? userData.address[0].user_address
          : ""
        : "",
      landmark: userData.hasOwnProperty("address")
        ? userData.address.length > 0
          ? userData.address[0].landmark
          : ""
        : "",
      password: "",
      newPassword: "",
      cofirmNewPassword: "",
      flage: false,
      dial_code: null,
      dial_value: false,
      Loader: false,
      image: "",
      imagePrev: userData.hasOwnProperty("profile_image")
        ? userData.profile_image.image_url
        : process.env.REACT_APP_DEFAULT_IMAGE,
      country_name: userData.hasOwnProperty("country_name")
        ? userData.country_name
        : "",
      country_code: userData.hasOwnProperty("country_code")
        ? userData.country_code
        : "",

      currencies: {},
      languages: userData.hasOwnProperty("user_languages")
        ? userData.user_languages
        : "",
      changeDataP: false,
      allLanguages: [
        { value: "en", key: "en", text: "English" },
        { value: "hi", key: "hi", text: "Hindi" },
      ],
      lang: userData.hasOwnProperty("language_preference")
        ? userData.language_preference
        : "",
    };
  }

  componentDidMount() {
    this.getStripePlanDetail();
  }

  getStripePlanDetail = () => {
    fetch(mainUrl + "api/subscription/stripe/fetch", {
      method: "GET",
      headers: {
        Authorization: " Bearer " + token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.text())
      .then((responseText) => {
        responseText = JSON.parse(responseText);
        console.log("subscription detail", responseText);

        if (responseText.error) {
          console.log(responseText.error);
        } else {
          let abc = responseText.data.current_period_end;
          let xyz = responseText.data.current_period_start;

          const milliseconds = abc * 1000;
          const dateObject = new Date(milliseconds);

          const millisecondsForStart = xyz * 1000;
          const dateObjectForSTart = new Date(millisecondsForStart);

          const humanDateFormat = dateObject.toLocaleString();
          const humanDateFormatFOrStart = dateObjectForSTart.toLocaleString();
          console.log("humanDateFormat", humanDateFormat);
          let amount = responseText.data.plan.amount / 100;

          this.setState({
            planTitle: "Gold",
            planStartDate: humanDateFormatFOrStart,
            plaEndDate: humanDateFormat,
            planAmount: amount,
            planStatus: responseText.data.status,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleChangeForPhone = (value, data, event, formattedValue) => {
    this.setState({
      phone: formattedValue,
      dial_code: data.dialCode,
      country_name: data.name,
      country_code: data.countryCode,
      dial_value: true,
    });
  };
  handleFileChange = async (e, id) => {
    this.setState({
      Loader: true,
    });
    const filedata = e.target.files[0];
    const fd = new FormData();
    fd.append("profile_image", filedata, filedata.name);
    const response = await instance
      .post(requests.fetchProfileImage, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "multipart/form-data",
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.error.message;
        NotificationManager.error(errorMessage);
        console.log(errorMessage);
      });
    if (response && response.data) {
      let userData = response.data.data;
      this.props.LOGIN_USER_DETAIL(userData);
      this.setState(
        {
          imagePrev: userData.profile_image.image_url,
        },
        () => {
          this.setState({
            Loader: false,
          });
        }
      );
    }
    // this.toBase64(e.target.files[0]).then((data) => {
    //   this.setState({ image: data });
    // });
  };
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  redirectToList = () => {
    const { history } = this.props;
    if (history) history.push("/Restaurants");
  };

  onUpdateWithoutDial = async () => {
    let UpdateProfileUserData = {
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone,
      address: [
        {
          landmark: this.state.landmark,
          user_address: this.state.address,
        },
      ],
      country_name: this.state.country_name,
      country_code: this.state.country_code,
      user_languages: this.state.languages,
    };
    const response = await instance
      .patch(requests.fetchUpdateProfile, UpdateProfileUserData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.error.message;
        NotificationManager.error(errorMessage);
      });
    if (response && response.data) {
      let userData = response.data.data;
      this.props.LOGIN_USER_DETAIL(response.data.data);
      this.setState({
        flage: !this.state.flage,
      });
      this.setState({ changeDataP: true }, () => {
        this.getlanguagepreferences();
      });
    }
    if (this.state.changeDataP === false) {
      this.getlanguagepreferences();
    }
  };

  onUpdateWithDial = async () => {
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
            let UpdateProfileUserData = {
              name: this.state.name,
              email: this.state.email,
              phone: this.state.phone,
              address: [
                {
                  landmark: this.state.landmark,
                  user_address: this.state.address,
                },
              ],
              country_name: this.state.country_name,
              country_code: this.state.country_code,
              currencies: currencies,
              user_languages: this.state.languages,
            };

            const response = await instance
              .patch(requests.fetchUpdateProfile, UpdateProfileUserData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
              .catch((error) => {
                let errorMessage = error.response.data.error.message;
                NotificationManager.error(errorMessage);
              });
            if (response && response.data) {
              let userData = response.data.data;
              this.props.LOGIN_USER_DETAIL(userData);
              this.setState({
                flage: !this.state.flage,
              });
              if (this.state.changeDataP === false) {
                this.getlanguagepreferences();
              }
            }
          }
        );
      })
      .catch((error) => {
        console.log(error);
      });
    if (this.state.changeDataP === false) {
      this.getlanguagepreferences();
    }
  };

  onUpdateProfile = async () => {
    if (this.state.dial_value === true) {
      this.onUpdateWithDial();
    } else {
      this.onUpdateWithoutDial();
    }
  };

  onUpdatePassword = async () => {
    let updatePasswordUserData = {
      oldPassword: this.state.password,
      newPassword: this.state.newPassword,
    };
    const response = await instance
      .patch(requests.fetchChangePassword, updatePasswordUserData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.error.message;
        NotificationManager.error(errorMessage);
      });

    if (response && response.data) {
      const { history } = this.props;

      NotificationManager.success("Successfully Changed Password");
      setTimeout(() => {
        history.push("/profile");
      }, 1000);
    }
  };

  getlanguagepreferences = async () => {
    const data = {
      language_preference: this.state.lang,
    };
    console.log(data);
    const response = await instance
      .patch(requests.fetchLanguagePreference, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        const errorMessage = error.response.data.error.message;
        NotificationManager.error(errorMessage);
        console.log(errorMessage);
      });
    if (response && response.data) {
      const { history } = this.props;
      NotificationManager.success("Success Fully Update your profile");
      setTimeout(() => {
        history.push("/profile");
      }, 700);
    }
  };

  handleSelectChange = async (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  openAllPlanDetail = () => {
    // const { history } = this.props;
    // history.push("/updateStripe");
    this.setState({
      showPlans: true,
    });
  };

  render() {
    console.log("token", token);
    const userType = userData.registerType;
    let routes = adminRoutes;
    if (userData.registerType === "admin") {
      routes = adminRoutes;
    } else if (userData.registerType === "user") {
      routes = ownerRoutes;
    } else if (userData.registerType === "driver") {
      routes = driverRoutes;
    } else {
      routes = clientsRoutes;
    }
    const { image, imagePrev } = this.state;
    return (
      <>
        {!this.state.showPlans && (
          <Sidebar
            {...this.props}
            routes={routes}
            logo={{
              innerLink: "/admin/index",
              imgSrc: require("assets/img/brand/argon-react.png"),
              imgAlt: "...",
            }}
            img={this.state.imagePrev}
            name={this.state.name}
            isProfileChanged={true}
          />
        )}

        {!this.state.showPlans ? (
          <div className="main-content" ref="mainContent">
            <Navbar
              img={this.state.imagePrev}
              name={this.state.name}
              isProfileChanged={true}
            />
            <div
              className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
              style={{
                minHeight: "300px",
                backgroundImage:
                  "url(" + require("assets/img/theme/profile-cover.jpg") + ")",
                backgroundSize: "cover",
                backgroundPosition: "center top",
              }}
            >
              {/* Mask */}
              <span className="mask bg-gradient-default opacity-8" />
              {/* Header container */}
            </div>

            <Container className="mt--7" fluid>
              <Loader open={this.state.Loader} />
              <Row>
                <Col className="col">
                  <Card className="bg-secondary shadow">
                    <CardHeader className="border-0">
                      <div className="d-flex justify-content-between">
                        <div className="md-7">
                          <h1 className="mb-0">{i18next.t("Edit Profile")}</h1>
                        </div>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <Form>
                        <h6 className="heading-small text-muted mb-4">
                          {i18next.t("USER INFORMATION")}
                        </h6>
                        {this.state.flage && <AlertSuccess />}
                        <div className="pl-lg-4">
                          <Row>
                            <Col md="6" sm="6" lg="6" xl="4" ld="6">
                              <FormGroup className="text-center font-weight-bold mb-4">
                                <Label for="input-name">
                                  {i18next.t("Profile Image")}
                                </Label>
                                <div className="text-center">
                                  <div
                                    className="fileinput fileinput-new"
                                    dataprovider="fileinput"
                                  >
                                    <div className="fileinput-preview img-thumbnail">
                                      <img
                                        src={
                                          image.length !== 0 ? image : imagePrev
                                        }
                                        style={{
                                          width: "100%",
                                          height: "200px",
                                          objectFit: "cover",
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <span className="btn btn-outline-secondary btn-file mt-3">
                                      {image.length === 0 ? (
                                        <span className="fileinput-new">
                                          {i18next.t("Upload Image")}
                                        </span>
                                      ) : (
                                        <span className="fileinput-exists">
                                          {i18next.t("Change")}
                                        </span>
                                      )}
                                      <input
                                        type="file"
                                        name="resto_logo"
                                        onChange={(e) => {
                                          this.handleFileChange(
                                            e,
                                            userData._id
                                          );
                                        }}
                                        accept="image/x-png,image/gif,image/jpeg"
                                      />
                                    </span>
                                    {image.length !== 0 && (
                                      <button
                                        onClick={this.handleRemoveFile}
                                        className="btn btn-outline-secondary fileinput-exists mt-3"
                                        data-dismiss="fileinput"
                                      >
                                        {i18next.t("Remove")}
                                      </button>
                                    )}
                                  </div>
                                </div>
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
                                  {i18next.t("Name")}
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  type="text"
                                  name="name"
                                  placeholder={i18next.t("Name")}
                                  value={this.state.name}
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
                                  {i18next.t("Email")}
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  type="email"
                                  name="email"
                                  placeholder={i18next.t("Email")}
                                  value={this.state.email}
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
                                  {i18next.t("Phone Number")}
                                </label>
                                <PhoneInput
                                  inputProps={{
                                    name: "phone",
                                    required: true,
                                  }}
                                  inputStyle={{ width: "100%" }}
                                  placeholder={i18next.t("Phone Number")}
                                  country={"in"}
                                  value={this.state.phone}
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

                          <Row>
                            <Col md="12">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-address"
                                >
                                  {i18next.t("Address")}
                                </label>
                                <Input
                                  type="textarea"
                                  name="address"
                                  value={this.state.address}
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
                                  htmlFor="input-landmark"
                                >
                                  {i18next.t("Landmark")}
                                </label>
                                <Input
                                  type="text"
                                  name="landmark"
                                  value={this.state.landmark}
                                  onChange={(e) => this.handleChange(e)}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col md="12">
                              <FormGroup>
                                <label for="transl">
                                  {i18next.t(
                                    "Select Language for your email and other Notification"
                                  )}
                                </label>
                                <Input
                                  type="select"
                                  name="lang"
                                  id="lang"
                                  onChange={this.handleSelectChange}
                                  value={this.state.lang}
                                >
                                  <option value="">--select Language--</option>
                                  {this.state.allLanguages.map((lange) => {
                                    return (
                                      <>
                                        <option value={lange.value}>
                                          {lange.text}
                                        </option>
                                      </>
                                    );
                                  })}
                                </Input>
                              </FormGroup>
                            </Col>
                          </Row>
                          <center>
                            <Row>
                              <Col md="12">
                                <FormGroup>
                                  <Button
                                    className="my-4"
                                    color="success"
                                    type="button"
                                    onClick={() => this.onUpdateProfile()}
                                  >
                                    {i18next.t("save")}
                                  </Button>
                                </FormGroup>
                              </Col>
                            </Row>
                          </center>
                        </div>
                        <hr className="my-4" />
                        {/* Address */}
                        <h6 className="heading-small text-muted mb-4">
                          {i18next.t("PASSWORD")}
                        </h6>
                        <div className="pl-lg-4">
                          <Row>
                            <Col md="12">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-address"
                                >
                                  {i18next.t("Current Password")}
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  type="password"
                                  name="password"
                                  placeholder={i18next.t("Current Password")}
                                  value={this.state.currentPassword}
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
                                  {i18next.t("New Password")}
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  type="password"
                                  name="newPassword"
                                  placeholder={i18next.t("New Password")}
                                  value={this.state.newPassword}
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
                                  {i18next.t("Confirm New Password")}
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  type="password"
                                  name="cofirmNewPassword"
                                  placeholder={i18next.t(
                                    "Confirm New Password"
                                  )}
                                  value={this.state.cofirmNewPassword}
                                  onChange={(e) => this.handleChange(e)}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </div>
                        <center>
                          <Button
                            className="my-4"
                            color="success"
                            type="button"
                            onClick={() => this.onUpdatePassword()}
                          >
                            {i18next.t("Change Password")}
                          </Button>
                        </center>
                      </Form>
                      <hr className="my-4" />
                      <h6 className="heading-small text-muted mb-4">
                        {i18next.t("Subcription plan")}
                      </h6>
                      <div className="col">
                        <Card className="shadow">
                          <CardHeader className="border-0">
                            <div className="d-flex justify-content-between">
                              <div className="md-7">
                                <h4 className="mb-0 planHeader">
                                  {" "}
                                  Plan type :{/* {planHeader} */}
                                </h4>
                              </div>
                              <div className="md-5">
                                <Row>
                                  <Col></Col>
                                </Row>
                              </div>
                            </div>
                          </CardHeader>
                          <Row>
                            <div className="col">
                              <Row className="p-3">
                                <Col className="p-3">
                                  <h3>Your plan detail:</h3>
                                </Col>
                                <Col className="p-3">
                                  <h3>Status: {this.state.planStatus}</h3>
                                </Col>
                              </Row>
                              <Row>
                                <Col
                                  className="p-3"
                                  md={12}
                                  ld={12}
                                  sm={12}
                                  xs={12}
                                  lg={12}
                                >
                                  <Card>
                                    <CardBody
                                      style={{
                                        pointerEvents: "auto",
                                        opacity: "1",
                                      }}
                                    >
                                      <Row className="p-3">
                                        <Col>
                                          <CardTitle className="display-5">
                                            {" "}
                                            <b>Title:</b>
                                            {this.state.planTitle}
                                          </CardTitle>
                                        </Col>
                                        <Col>
                                          <CardTitle className="display-5">
                                            <b>Amount/Period:</b>
                                            {this.state.planAmount}
                                          </CardTitle>
                                        </Col>
                                        <Col>
                                          <CardTitle className="display-5">
                                            <b>Subscription Start Date:</b>
                                            <br />
                                            {this.state.planStartDate}
                                          </CardTitle>
                                        </Col>
                                        <Col>
                                          <CardTitle className="display-5">
                                            <b> Subscription End Date:</b>
                                            <br />
                                            {this.state.plaEndDate}
                                          </CardTitle>
                                        </Col>
                                      </Row>
                                      <Row className="p-3">
                                        <Col>
                                          <br />
                                          <br />
                                          <CardTitle className="display-5">
                                            {" "}
                                            Features:{" "}
                                          </CardTitle>
                                          <CardText></CardText>
                                        </Col>
                                      </Row>
                                      <Row className="p-3">
                                        {this.state.planStatus ===
                                        "trialing" ? (
                                          <Col>
                                            <Button
                                              onClick={this.openAllPlanDetail}
                                              color="primary"
                                            >
                                              Update your plan
                                            </Button>
                                          </Col>
                                        ) : (
                                          <>
                                            <Col>
                                              <Button
                                                // onClick={() => {
                                                //   this.openAllPlanDetail();
                                                // }}
                                                onClick={this.openAllPlanDetail}
                                                color="primary"
                                              >
                                                Update your plan
                                              </Button>
                                            </Col>
                                            <Col>
                                              <Button
                                                // onClick={cancelStripeSubscrptionPlan}
                                                color="danger"
                                              >
                                                Cancel Your Plan
                                              </Button>
                                            </Col>
                                          </>
                                        )}
                                      </Row>
                                    </CardBody>
                                  </Card>
                                </Col>
                              </Row>
                            </div>
                          </Row>
                        </Card>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>

            <Container fluid>
              <AdminFooter />
            </Container>
          </div>
        ) : (
          <div>
            {" "}
            <StripePlan updatePlan={this.state.showPlans} />
          </div>
        )}

        <NotificationContainer />
      </>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
