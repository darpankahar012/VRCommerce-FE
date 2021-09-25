import React from "react";
// react component that copies the given text inside your clipboard
import { CopyToClipboard } from "react-copy-to-clipboard";
// reactstrap components

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
import i18next from "i18next";
// Country and Rigion
import {
  CountryDropdown,
  RegionDropdown,
  CountryRegionData,
} from "react-country-region-selector";

// core components
import Header from "components/Headers/Header.js";
import { Route, Switch, Redirect } from "react-router-dom";
// reactstrap components
// core components
import AdminNavbar from "../../../Navbars/AdminNavbar";
import AdminFooter from "../../../Footers/AdminFooter.js";
import Sidebar from "../../../Sidebar/Sidebar.js";

import routes from "../../../../routes";

//Navbar
import Navbar from "../../../Navbars/AdminNavbar";

// For Redux Data
import { bindActionCreators } from "redux";
import { ActCreators } from "../../../../redux/bindActionCreator";
import { connect } from "react-redux";

// server instance
import instance from "../../../../axios";
import requests from "../../../../requests";

// Notification
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

//Alert
import { Alert } from "reactstrap";

let EditCityDetail = {};
let token = null;

const mapStateToProps = (state) => {
  EditCityDetail = state.EditCityDetail;
  token = state.token;
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};

class CityEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      image: "",
      id: EditCityDetail.hasOwnProperty("_id") ? EditCityDetail._id : "",
      cityName: EditCityDetail.hasOwnProperty("city_name")
        ? EditCityDetail.city_name
        : "",
      shortCode: EditCityDetail.hasOwnProperty("short_code")
        ? EditCityDetail.short_code
        : "",
      headerTitle: EditCityDetail.hasOwnProperty("title")
        ? EditCityDetail.title
        : "",
      headerSubtitle: EditCityDetail.hasOwnProperty("sub_title")
        ? EditCityDetail.sub_title
        : "",
      state: EditCityDetail.hasOwnProperty("state") ? EditCityDetail.state : "",
      country: EditCityDetail.hasOwnProperty("country_name")
        ? EditCityDetail.country_name
        : "",
      imagePrev: EditCityDetail.hasOwnProperty("city_image") ? EditCityDetail.city_image.image_url : process.env.REACT_APP_DEFAULT_IMAGE,
      visible: false,
      City_image: "",
    };
  }

  selectCountry(val) {
    this.setState({ country: val });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  onDismiss = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };
  onUpdateCity = async () => {
    debugger;
    const fd = new FormData();
    
    if (this.state.id.length > 0) {
      fd.append("city_id", this.state.id);
    }
    if (this.state.cityName.length > 0) {
      fd.append("city_name", this.state.cityName);
    }
    if (this.state.shortCode.length > 0) {
      fd.append("short_code", this.state.shortCode);
    }
    if (this.state.headerTitle.length > 0) {
      fd.append("title", this.state.headerTitle);
    }
    if (this.state.headerSubtitle.length > 0) {
      fd.append("sub_title", this.state.headerSubtitle);
    }
    if (this.state.country.length > 0) {
      fd.append("country_name", this.state.country);
    }
    if (this.state.state.length > 0) {
      fd.append("state", this.state.state);
    }

    if (this.state.City_image.length === 0) {
      console.log("you didn't change your image")
    } else {
      fd.append(
        "city_image",
        this.state.City_image,
        this.state.City_image.name
      );
    }
    const response = await instance
      .patch(requests.fetchUpdateCity, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.error.message;
        NotificationManager.error(errorMessage);
      });
    if (response && response.data) {
      this.setState(
        {
          visible: !this.state.visible,
        },
        () => {
          const { history } = this.props;
          if (history) history.push("/city");
        }
      );
    }
  };
  redirectToList = () => {
    const { history } = this.props;
    if (history) history.push("/city");
  };
  handleFileChange = (e) => {
    //alert("Call File change");
    const data = e.target.files[0];
    this.setState(
      { City_image: data, image: URL.createObjectURL(data) }
    );
  };

  toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  handleRemoveFile = (e) => {
    e.preventDefault();
    this.setState({ image: "", City_image: "" });
  };

  render() {
    const {
      coverImage,
      imagePrev,
      image,
      state,
      cityName,
      shortCode,
      headerTitle,
      headerSubtitle,
      country,
      region,
    } = this.state;
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
            <Container className="d-flex align-items-center">
              <Row>
                <Col lg="7" md="10">
                  <h3 className="display-3 text-white"></h3>
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
                        <h1 className="mb-0">{i18next.t("Edit City")}</h1>
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
                      <h6 className="heading-small text-muted mb-4"></h6>
                      <div className="pl-lg-4">
                        <Row>
                          <Col md={12}>
                            <Alert
                              autofocus
                              color="success"
                              isOpen={this.state.visible}
                              toggle={this.onDismiss}
                            >
                              {i18next.t("Successfully Updated City Data...!")}
                            </Alert>
                            <FormGroup className="text-center font-weight-bold mb-12">
                              <Label for="input-name">{i18next.t("City Image")}</Label>
                              <div>
                                <div
                                  className="fileinput fileinput-new"
                                  dataprovider="fileinput"
                                >
                                  <center>
                                    <div
                                      className="fileinput-preview img-thumbnail"
                                      style={{
                                        width: "280px",
                                        height: "210px",
                                      }}
                                    >
                                      <img
                                        src={
                                          image.length !== 0 ? image : imagePrev
                                        }
                                        style={{
                                          width: "270px",
                                          height: "200px",
                                          objectFit: "cover",
                                        }}
                                      />
                                    </div>
                                  </center>
                                </div>
                                <div>
                                  <span className="btn btn-outline-secondary btn-file mt-3">
                                    {image.length === 0 ? (
                                      <span className="fileinput-new">
                                        {i18next.t("Upload image")}
                                      </span>
                                    ) : (
                                      <span className="fileinput-exists">
                                        {i18next.t("Change")}
                                      </span>
                                    )}
                                    <input
                                      type="file"
                                      name="resto_logo"
                                      onChange={this.handleFileChange}
                                      accept="image/x-png,image/gif,image/jpeg"
                                    />
                                  </span>
                                  {image.length !== 0 && (
                                    <button
                                      className="btn btn-outline-secondary fileinput-exists mt-3"
                                      data-dismiss="fileinput"
                                      onClick={this.handleRemoveFile}
                                    >
                                      {i18next.t("Remove")}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </FormGroup>
                          </Col>
                          <Col md="12">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-address"
                              >
                                {i18next.t("Country Name")}
                              </label>
                              <div>
                                <CountryDropdown
                                  className="form-control"
                                  value={country}
                                  onChange={(val) => this.selectCountry(val)}
                                />
                              </div>
                            </FormGroup>
                          </Col>
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
                                placeholder={i18next.t("Name")}
                                type="text"
                                name="cityName"
                                value={this.state.cityName}
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
                                htmlFor="state"
                              >
                                {i18next.t("State")}
                              </label>
                              <Input
                                className="form-control-alternative"
                                placeholder={i18next.t("State")}
                                type="text"
                                name="state"
                                value={state}
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
                                {i18next.t("City 2 - 3 letter short code")}
                              </label>
                              <Input
                                className="form-control-alternative"
                                placeholder={i18next.t("City 2 - 3 letter short code")}
                                type="test"
                                name="shortCode"
                                value={this.state.shortCode}
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
                                {i18next.t("Header Title")}
                              </label>
                              <Input
                                className="form-control-alternative"
                                placeholder={i18next.t("Header Title")}
                                type="text"
                                name="headerTitle"
                                value={this.state.headerTitle}
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
                                {i18next.t("Header Subtitle")}
                              </label>
                              <Input
                                className="form-control-alternative"
                                placeholder={i18next.t("Header Subtitle")}
                                type="text"
                                name="headerSubtitle"
                                value={this.state.headerSubtitle}
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
                          onClick={this.onUpdateCity}
                        >
                          {i18next.t("save")}
                        </Button>
                      </center>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <NotificationContainer />
          </Container>

          <Container fluid>
            <AdminFooter />
          </Container>
        </div>
      </>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CityEdit);
