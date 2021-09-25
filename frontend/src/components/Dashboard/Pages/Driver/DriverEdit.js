import React from "react";
// react component that copies the given text inside your clipboard
import { CopyToClipboard } from "react-copy-to-clipboard";
// reactstrap components

import i18next from "i18next"

import { Dropdown } from "semantic-ui-react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
  Col,
  Label,
  Button,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
} from "reactstrap";
import ReactDatetime from "react-datetime";

//Navbar
import Navbar from "../../../../components/Navbars/AdminNavbar";

// core components
import Header from "components/Headers/Header.js";
import { Route, Switch, Redirect } from "react-router-dom";
// core components
import AdminFooter from "../../../../components/Footers/AdminFooter.js";
import Sidebar from "../../../../components/Sidebar/Sidebar.js";

import routes from "../../../../routes.js";

// For Redux Data
import { bindActionCreators } from "redux";
import { ActCreators } from "../../../../redux/bindActionCreator";
import { connect } from "react-redux";
import instance from "../../../../axios";
import requests from "../../../../requests";
//import "./Details.css"

// Alert
import { Alert } from "reactstrap";

// Axios
import axios from "axios";

//Phone Number Input
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";

// Notification
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

let token = null;
let EditDriverDetail = {};

const mapStateToProps = (state) => {
  token = state.token;
  EditDriverDetail = state.EditDriverDetail;
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};

class DriverEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      driverId: EditDriverDetail._id,
      driverName: EditDriverDetail.name,
      driverEmail: EditDriverDetail.email,
      driverPhone: EditDriverDetail.phone,
      isActive: EditDriverDetail.isRestaurantDrivers,
      visible: false,
      ownerData: [],
      restaurant: EditDriverDetail.employeer_id,

      dial_code: EditDriverDetail.dial_code,
      country_name: EditDriverDetail.country_name,
      country_code: EditDriverDetail.country_code,

      currencies: EditDriverDetail.currencies,
      languages: EditDriverDetail.languages,
    };
  }

  componentDidMount = async () => {
    let bodyAPI = {
      pageno: 1,
      perpage: 100,
    };
    const response = await instance
      .post(requests.fetchRestaurantDetailsAtAdmin, bodyAPI, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.error.message;
        NotificationManager.error(errorMessage);
      });
    if (response && response.data) {
      let ad = [];
      const CData =
          response.data.data.Restaurants != null
            ? response.data.data.Restaurants.map((Cd, i) => {
                ad[i] = {
                  value: Cd._id,
                  key: Cd._id,
                  text: Cd.name,
                };
              })
            : [{ value: "", label: "", key: "" }];
      this.setState({
        ownerData: ad,
      });
    }
  };

  handleChangeForPhone = (value, data, event, formattedValue) => {
    this.setState({
      ownerPhone: formattedValue,
      dial_code: data.dialCode,
      country_name: data.name,
      country_code: data.countryCode,
    });
  };

  handleSelectChange = (e, data) => {
    this.setState({
      [data.name]: data.value,
    });
  };

  UpdateDriver = async () => {
    axios
      .get(
        "https://restcountries.eu/rest/v2/callingcode/91?fields=name;callingCodes;languages;currencies"
      )
      .then((response) => {
        let languages = [];
        response.data[0].languages.map((data, i) => {
          languages.push(data.name);
        });
        this.setState({
          currencies: response.data[0].currencies[0],
          languages: languages,
        });
      })
      .catch((error) => {
        console.log(error);
      });

    let emp_id = null;
    if (this.state.restaurant) {
      emp_id = this.state.restaurant;
    }
    let bodyAPI = {
      driver_id: this.state.driverId,
      name: this.state.driverName,
      phone: this.state.driverPhone,
      email: this.state.driverEmail,
      isRestaurantDrivers: !this.state.isActive,
      employeer_id: emp_id,
      dial_code: this.state.dial_code,
      country_name: this.state.country_name,
      country_code: this.state.country_code,
      currencies: this.state.currencies,
      user_languages: this.state.languages,
    };
    const response = await instance
      .patch(requests.fetchUpdateDriverFromAdmin, bodyAPI, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.error.message;
        NotificationManager.error(errorMessage);
      });
    if (response && response.data) {
      this.setState({
        visible: !this.state.visible,
      });
      const { history } = this.props;
      setTimeout(() => {
        if (history) history.push("/drivers");
      }, 2000);
    }
  };
  onDismiss = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };
  handleChange(e) {
    if (e.target.type != "checkbox") {
      this.setState({
        [e.target.name]: e.target.value,
      });
    } else {
      const name = e.target.name;
      const value = e.target.checked;
      this.setState({
        [name]: value,
      });
    }
  }
  redirectToList = () => {
    const { history } = this.props;
    if (history) history.push("/drivers");
  };

  render() {
    let { isActive } = this.state;
    return (
      <>
        <Sidebar
          {...this.props}
          routes={routes}
          logo={{
            innerLink: "/admin/index",
            imgSrc: require("assets/img/brand/argon-react.png"),
            imgAlt: "...",
          }}
        />
        <div className="main-content" ref="mainContent">
          <Navbar />
          <div
            className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
            style={{
              minHeight: "400px",
              backgroundImage:
                "url(" + require("assets/img/theme/profile-cover.jpg") + ")",
              backgroundSize: "cover",
              backgroundPosition: "center top",
            }}
          >
            {/* Mask */}
            <span className="mask bg-gradient-default opacity-8" />
            {/* Header container */}
            <Container className="d-flex align-items-center">
              <Row>
                <Col lg="7" md="10">
                  <h3 className="display-3 text-white">{i18next.t("Add Driver")}</h3>
                </Col>
              </Row>
            </Container>
          </div>
          <Container className="mt--7" fluid>
            <Row>
              <Col className="col">
                <Card className="bg-secondary shadow">
                  <CardHeader className="border-0">
                    <div className="d-flex justify-content-between">
                      <div className="md-7">
                        <h1 className="mb-0">{i18next.t("Drivers Management")}</h1>
                      </div>
                      <div className="md-5">
                        <Row>
                          <Col>
                            <Button
                              color="primary"
                              size="sm"
                              type="button"
                              onClick={this.redirectToList}
                            >
                              {i18next.t("Back to List")}
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <Form>
                      <Alert
                        autofocus
                        color="success"
                        isOpen={this.state.visible}
                        toggle={this.onDismiss}
                      >
                        {i18next.t("Successfully Update Driver...!")}
                      </Alert>
                      <h6 className="heading-small text-muted mb-4">
                        {i18next.t("DRIVER INFORMATION")}
                      </h6>
                      <div className="pl-lg-4">
                        <Row>
                          <Col md="12">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-address"
                              >
                                {i18next.t("Driver Name")}
                              </label>
                              <Input
                                className="form-control-alternative"
                                placeholder={i18next.t("Driver Name")}
                                type="text"
                                name="driverName"
                                value={this.state.driverName}
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
                                {i18next.t("Driver Email")}
                              </label>
                              <Input
                                className="form-control-alternative"
                                placeholder={i18next.t("Driver Email")}
                                type="email"
                                name="driverEmail"
                                value={this.state.driverEmail}
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
                                {i18next.t("Driver Phone")}
                              </label>
                              <PhoneInput
                                inputProps={{
                                  name: "driverPhone",
                                  required: true,
                                  autoFocus: true,
                                }}
                                inputStyle={{ width: "100%" }}
                                placeholder={i18next.t("Driver Phone Number")}
                                country={"in"}
                                value={this.state.driverPhone}
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
                                {i18next.t("Is Restaurant Driver")}
                              </label>{" "}
                              <br />
                              <label className="custom-toggle">
                                {this.state.isActive === true ? (
                                  <input
                                    defaultChecked
                                    type="checkbox"
                                    name="isActive"
                                    onChange={(e) => {
                                      this.handleChange(e);
                                    }}
                                  />
                                ) : (
                                  <input
                                    type="checkbox"
                                    name="isActive"
                                    onChange={(e) => {
                                      this.handleChange(e);
                                    }}
                                  />
                                )}
                                <span className="custom-toggle-slider rounded-circle" />
                              </label>
                            </FormGroup>
                          </Col>
                        </Row>
                        {this.state.isActive === true && (
                          <Row>
                            <Col md="12">
                              <FormGroup>
                                <Label for="Restaurant">
                                  {i18next.t("Select Restaurant for Driver")}
                                </Label>
                                <Dropdown
                                  placeholder={i18next.t("Select Driver")}
                                  fluid
                                  search
                                  selection
                                  clearable
                                  name="restaurant"
                                  options={this.state.ownerData}
                                  onChange={this.handleSelectChange}
                                  value={this.state.restaurant}
                                  // name="client"
                                />
                                {/* <Input type="select" name="restaurant" id="restaurant"
                                  onChange={(e) => {this.handleChange(e)}}
                                  value={this.state.restaurant}
                                >
                                  <option value="" selected>--- Select ---</option>
                                  {
                                    this.state.ownerData.map((data,i) => {
                                      if(data.restaurant_Name)
                                      {
                                        return(
                                          <option value={data._id}>
                                            {data.restaurant_Name}
                                          </option>
                                        )
                                      }
                                    })
                                  }
                                </Input>  */}
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
                          onClick={this.UpdateDriver}
                        >
                          {i18next.t("Update")}
                        </Button>
                      </center>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>

          <Container fluid>
            <AdminFooter />
          </Container>
        </div>
      </>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(DriverEdit);
