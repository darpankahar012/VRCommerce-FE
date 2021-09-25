import React from "react";

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
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
} from "reactstrap";

import i18next from "i18next";

// For Redux Data
import { bindActionCreators } from "redux";
import { ActCreators } from "../../../../redux/bindActionCreator";
import { connect } from "react-redux";

// Server Port Instance
import instance from "../../../../axios";
import requests from "../../../../requests";

// Notification
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

//import firebase, { storage } from "../../../firebase";

import classnames from "classnames";

// Alert
import { Alert } from "reactstrap";
import { Link } from "react-router-dom";

let token = null;

const mapStateToProps = (state) => {
  token = state.token;
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};

class Setting extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabs: 1,
      siteID: "5f896cf681eb0371e0dfba39",
      siteName: "",
      siteDesc: "",
      headerTitle: "",
      headerSubTitle: "",
      deliveryCost: "",
      defaultImage: "",
      searchCoverImage: "",
      siteLogo: "",
      restuarantCoverImage: "",
      defaultImagefileUrl: "",
      facebook: "",
      instagram: "",
      infoTitle: "",
      infoSubTitle: "",
      playStore: "",
      appStore: "",
      visible: false,
    };
  }

  onDismiss = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };

  getDefualtImage = async () => {
    const response = await instance
      .get(requests.fetchAllDefaultImage, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.error.message;
        NotificationManager.error(errorMessage);
        console.log(errorMessage);
      });
    if (response && response.data) {
      this.setState({
        restuarantCoverImageprev: response.data.data.hasOwnProperty(
          "restaurant_cover_image"
        )
          ? `${response.data.data.restaurant_cover_image.image_url}`
          : `${response.data.data.default_image.image_url}`,
        siteLogoprev: response.data.data.hasOwnProperty("site_logo")
          ? `${response.data.data.site_logo.image_url}`
          : `${response.data.data.default_image.image_url}`,
        searchCoverImageprev: response.data.data.hasOwnProperty("search_cover")
          ? `${response.data.data.search_cover.image_url}`
          : `${response.data.data.default_image.image_url}`,
        defaultImageprev: response.data.data.hasOwnProperty(
          "restaurant_default_image"
        )
          ? `${response.data.data.restaurant_default_image.image_url}`
          : `${response.data.data.default_image.image_url}`,
      });
    }
  };

  getSiteSettingData = async () => {
    let SiteId = {
      site_id: "5f896cf681eb0371e0dfba39",
    };
    const response = await instance
      .post(requests.fetchSiteInfo, SiteId, {
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
        siteName: response.data.data.siteInfo.site_Name,
        siteDesc: response.data.data.siteInfo.site_Description,
        headerTitle: response.data.data.siteInfo.title,
        headerSubTitle: response.data.data.siteInfo.subtitle,
        deliveryCost: response.data.data.siteInfo.delievery_Cost_fixed,
      });
    }

    // Links Tab API Integration
    let LinkId = {
      link_id: "5f883e12f467716db0d5b5fc",
    };
    const response_of_link = await instance
      .post(requests.fetchLinkInfoForAdmin, LinkId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        // let errorMessage = error.response_of_link.data.error.message;
        // NotificationManager.error(error.response_of_link.data.error.message);
        console.log("error", error);
      });
    if (response_of_link && response_of_link.data) {
      this.setState({
        facebook: response_of_link.data.data.links.facebook_link,
        instagram: response_of_link.data.data.links.instagram_link,
        infoTitle: response_of_link.data.data.links.info_title,
        infoSubTitle: response_of_link.data.data.links.info_subtitle,
        playStore: response_of_link.data.data.links.playstore_link,
        appStore: response_of_link.data.data.links.appstore_link,
      });
    }
  };

  componentDidMount = async () => {
    // Site Infomarion API Integration
    this.getSiteSettingData();
    this.getDefualtImage();
  };
  UpdateSiteData = async () => {
    let SiteInfo = {
      site_id: "5f896cf681eb0371e0dfba39",
      site_Name: this.state.siteName,
      site_Description: this.state.siteDesc,
      title: this.state.headerTitle,
      subtitle: this.state.headerSubTitle,
      delievery_Cost_fixed: this.state.deliveryCost,
    };
    const response = await instance
      .post(requests.fetchUpdateSiteInfo, SiteInfo, {
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
        siteName: response.data.data.siteInfo.site_Name,
        siteDesc: response.data.data.siteInfo.site_Description,
        headerTitle: response.data.data.siteInfo.title,
        headerSubTitle: response.data.data.siteInfo.subtitle,
        deliveryCost: response.data.data.siteInfo.delievery_Cost_fixed,
        visible: !this.state.visible,
      });
    }
  };

  UpdateLinkData = async () => {
    let LinkData = {
      link_id: "5f883e12f467716db0d5b5fc",
      facebook_link: this.state.facebook,
      instagram_link: this.state.instagram,
      info_title: this.state.infoTitle,
      info_subtitle: this.state.infoSubTitle,
      playstore_link: this.state.playStore,
      appstore_link: this.state.appStore,
    };
    const response = await instance
      .post(requests.fetchUpdateLinkData, LinkData, {
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
        facebook: response.data.data.links.facebook_link,
        instagram: response.data.data.links.instagram_link,
        infoTitle: response.data.data.links.info_title,
        infoSubTitle: response.data.data.links.info_subtitle,
        playStore: response.data.data.links.playstore_link,
        appStore: response.data.data.links.appstore_link,
        visible: !this.state.visible,
      });
    }
  };

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  toggleNavs = (e, state, index) => {
    e.preventDefault();
    this.setState({
      [state]: index,
      flag: !this.state,
    });
  };

  handleFileChangedefaultImage = (e) => {
    const data = e.target.files[0];
    this.setState({
      defaultImageData: data,
      defaultImage: URL.createObjectURL(data),
    });
  };

  handleRemoveFiledefaultImage = (e) => {
    e.preventDefault();
    this.setState({ defaultImageData: "", defaultImage: "" });
  };

  handleFileChangesearchCoverImage = (e) => {
    //alert("Call File change");
    // this.toBase64(e.target.files[0]).then((data) => {
    //   this.setState({ searchCoverImage: data });
    // });

    const data = e.target.files[0];
    this.setState({
      searchCoverImageData: data,
      searchCoverImage: URL.createObjectURL(data),
    });
  };
  handleRemoveFilesearchCover = (e) => {
    e.preventDefault();
    this.setState({ searchCoverImage: "", searchCoverImageData: "" });
  };
  handleFileChangesiteLogo = (e) => {
    //alert("Call File change");
    // this.toBase64(e.target.files[0]).then((data) => {
    //   this.setState({ siteLogo: data });
    // });
    const data = e.target.files[0];
    this.setState({ siteLogoData: data, siteLogo: URL.createObjectURL(data) });
  };
  handleRemoveFilesiteLogo = (e) => {
    e.preventDefault();
    this.setState({ siteLogo: "", siteLogoData: "" });
  };
  handleFileChangerestuarantCoverImage = (e) => {
    //alert("Call File change");
    // this.toBase64(e.target.files[0]).then((data) => {
    //   this.setState({ restuarantCoverImage: data });
    // });

    const data = e.target.files[0];
    this.setState({
      restuarantCoverImageData: data,
      restuarantCoverImage: URL.createObjectURL(data),
    });
  };
  handleRemoveFilerestuarantCoverImage = (e) => {
    e.preventDefault();
    this.setState({ restuarantCoverImageData: "", restuarantCoverImage: "" });
  };

  handleSubmitDImages = async () => {
    const fd = new FormData();
    const id = "5fbcfc737cf0606e8d4f9938";
    fd.append("id", id);
    if (this.state.restuarantCoverImageData) {
      fd.append(
        "restaurant_cover_image",
        this.state.restuarantCoverImageData,
        this.state.restuarantCoverImageData.name
      );
    }
    if (this.state.defaultImageData) {
      fd.append(
        "restaurant_default_image",
        this.state.defaultImageData,
        this.state.defaultImageData.name
      );
    }
    if (this.state.searchCoverImageData) {
      fd.append(
        "search_cover",
        this.state.searchCoverImageData,
        this.state.searchCoverImageData.name
      );
    }
    if (this.state.siteLogoData) {
      fd.append(
        "site_logo",
        this.state.siteLogoData,
        this.state.siteLogoData.name
      );
    }
    const response = await instance
      .post(requests.fetchAddImage, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "multipart/form-data",
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.error.message;
        // NotificationManager.error(errorMessage);
        console.log(errorMessage);
      });
    if (response && response.data) {
      this.setState(
        {
          restuarantCoverImageData: "",
          restuarantCoverImage: "",
          siteLogoData: "",
          siteLogo: "",
          searchCoverImageData: "",
          searchCoverImage: "",
          defaultImageData: "",
          defaultImage: "",
        },
        () => {
          this.getDefualtImage();
        }
      );
    }
  };

  render() {
    const {
      defaultImage,
      searchCoverImage,
      siteLogo,
      restuarantCoverImage,
      defaultImageprev,
      searchCoverImageprev,
      siteLogoprev,
      restuarantCoverImageprev,
    } = this.state;
    return (
      <>
        {/* header */}
        <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
          <Container fluid>
            <div className="header-body">
              {/* Card stats */}
              <br />
              <br />
            </div>
          </Container>
        </div>

        <Container className="mt--7" fluid>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <div className="d-flex justify-content-between">
                    <div className="md-7">
                      <h1 className="mb-0">
                        {i18next.t("Seetings Management")}
                      </h1>
                    </div>
                    <div className="md-5">
                      <Row>
                        <Col></Col>
                      </Row>
                    </div>
                  </div>
                  <div>
                    <br />
                    <Alert
                      autofocus
                      color="success"
                      isOpen={this.state.visible}
                      toggle={this.onDismiss}
                    >
                      {i18next.t("Site Information Successfully Updated...!")}
                    </Alert>
                  </div>
                </CardHeader>
                <CardBody>
                  <Nav
                    // className="nav-fill flex-column flex-md-row tabbable sticky "
                    className="nav-fill flex-column flex-md-row "
                    id="tabs-icons-text"
                    pills
                    role="tablist"
                  >
                    <NavItem>
                      <NavLink
                        aria-selected={this.state.tabs === 1}
                        className={classnames("mb-sm-3 mb-md-0", {
                          active: this.state.tabs === 1,
                        })}
                        onClick={(e) => this.toggleNavs(e, "tabs", 1)}
                        href="#pablo"
                        role="tab"
                      >
                        <i className="ni ni-bullet-list-67 mr-2"></i>
                        {/* <i className="ni ni-cloud-upload-96 mr-2" /> */}
                        {"Site Info"}
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        aria-selected={this.state.tabs === 2}
                        className={classnames("mb-sm-3 mb-md-0", {
                          active: this.state.tabs === 2,
                        })}
                        onClick={(e) => this.toggleNavs(e, "tabs", 2)}
                        href="#pablo"
                        role="tab"
                      >
                        <i className="ni ni-image mr-2"></i>
                        {i18next.t("Images")}
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        aria-selected={this.state.tabs === 3}
                        className={classnames("mb-sm-3 mb-md-0", {
                          active: this.state.tabs === 3,
                        })}
                        onClick={(e) => this.toggleNavs(e, "tabs", 3)}
                        href="#pablo"
                        role="tab"
                      >
                        <i className="ni ni-ui-04 mr-2"></i>
                        {i18next.t("Links")}
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <br />
                  <br />

                  <TabContent
                    activeTab={this.state.tabs}
                    sm={12}
                    md={12}
                    xl={12}
                    xs={12}
                  >
                    <TabPane tabId={1}>
                      <Form>
                        <Row>
                          <Col md="12">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-sitename"
                              >
                                {i18next.t("Site Name")}
                              </label>
                              <Input
                                className="form-control-alternative"
                                type="test"
                                name="siteName"
                                value={this.state.siteName}
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
                                htmlFor="input-sitename"
                              >
                                {i18next.t("Site Description")}
                              </label>
                              <Input
                                className="form-control-alternative"
                                type="test"
                                name="siteDesc"
                                value={this.state.siteDesc}
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
                                htmlFor="input-sitename"
                              >
                                {i18next.t("Header Title")}
                              </label>
                              <Input
                                className="form-control-alternative"
                                type="test"
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
                                htmlFor="input-sitename"
                              >
                                {i18next.t("Header Subtitle")}
                              </label>
                              <Input
                                className="form-control-alternative"
                                type="test"
                                name="headerSubTitle"
                                value={this.state.headerSubTitle}
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
                                htmlFor="input-sitename"
                              >
                                {i18next.t("Delivery cost - fixed")}
                              </label>
                              <Input
                                className="form-control-alternative"
                                type="test"
                                name="deliveryCost"
                                value={this.state.deliveryCost}
                                onChange={(e) => this.handleChange(e)}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <center>
                          <Button
                            className="my-4"
                            color="success"
                            type="button"
                            onClick={this.UpdateSiteData}
                          >
                            {i18next.t("save")}
                          </Button>
                        </center>
                      </Form>
                    </TabPane>
                    <TabPane tabId={2}>
                      <Row>
                        <Col md={4}>
                          <FormGroup className="text-center font-weight-bold mb-12">
                            <Label for="input-name">
                              {i18next.t("Site Logo")}
                            </Label>
                            <div>
                              <div
                                className="fileinput fileinput-new"
                                dataprovider="fileinput"
                              >
                                <center>
                                  <div
                                    className="fileinput-preview img-thumbnail"
                                    style={{ width: "200px", height: "140px" }}
                                  >
                                    <img
                                      src={
                                        siteLogo.length !== 0
                                          ? siteLogo
                                          : siteLogoprev
                                      }
                                      style={{
                                        width: "190px",
                                        height: "130px",
                                        objectFit: "cover",
                                      }}
                                    />
                                  </div>
                                </center>
                              </div>
                              <div>
                                <span className="btn btn-outline-secondary btn-file mt-3">
                                  {siteLogo.length === 0 ? (
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
                                    name="searchCoverImage"
                                    onChange={this.handleFileChangesiteLogo}
                                    accept="image/x-png,image/gif,image/jpeg"
                                  />
                                </span>
                                {siteLogo.length !== 0 && (
                                  <button
                                    className="btn btn-outline-secondary fileinput-exists mt-3"
                                    data-dismiss="fileinput"
                                    onClick={this.handleRemoveFilesiteLogo}
                                  >
                                    {i18next.t("Remove")}
                                  </button>
                                )}
                              </div>
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup className="text-center font-weight-bold mb-12">
                            <Label for="input-name">
                              {i18next.t("Search Cover")}
                            </Label>
                            <div>
                              <div
                                className="fileinput fileinput-new"
                                dataprovider="fileinput"
                              >
                                <center>
                                  <div
                                    className="fileinput-preview img-thumbnail"
                                    style={{ width: "200px", height: "140px" }}
                                  >
                                    <img
                                      src={
                                        searchCoverImage.length !== 0
                                          ? searchCoverImage
                                          : searchCoverImageprev
                                      }
                                      style={{
                                        width: "190px",
                                        height: "130px",
                                        objectFit: "cover",
                                      }}
                                    />
                                  </div>
                                </center>
                              </div>
                              <div>
                                <span className="btn btn-outline-secondary btn-file mt-3">
                                  {searchCoverImage.length === 0 ? (
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
                                    name="searchCoverImage"
                                    onChange={
                                      this.handleFileChangesearchCoverImage
                                    }
                                    accept="image/x-png,image/gif,image/jpeg"
                                  />
                                </span>
                                {searchCoverImage.length !== 0 && (
                                  <button
                                    className="btn btn-outline-secondary fileinput-exists mt-3"
                                    data-dismiss="fileinput"
                                    onClick={this.handleRemoveFilesearchCover}
                                  >
                                    {i18next.t("Remove")}
                                  </button>
                                )}
                              </div>
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup className="text-center font-weight-bold mb-12">
                            <Label for="input-name">
                              {i18next.t("Restaurant Default Image")}
                            </Label>
                            <div>
                              <div
                                className="fileinput fileinput-new"
                                dataprovider="fileinput"
                              >
                                <center>
                                  <div
                                    className="fileinput-preview img-thumbnail"
                                    style={{ width: "200px", height: "140px" }}
                                  >
                                    <img
                                      src={
                                        defaultImage.length !== 0
                                          ? defaultImage
                                          : defaultImageprev
                                      }
                                      style={{
                                        width: "190px",
                                        height: "130px",
                                        objectFit: "cover",
                                      }}
                                    />
                                  </div>
                                </center>
                              </div>
                              <div>
                                <span className="btn btn-outline-secondary btn-file mt-3">
                                  {defaultImage.length === 0 ? (
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
                                    name="defaultImage"
                                    onChange={this.handleFileChangedefaultImage}
                                    accept="image/x-png,image/gif,image/jpeg"
                                  />
                                </span>
                                {defaultImage.length !== 0 && (
                                  <button
                                    className="btn btn-outline-secondary fileinput-exists mt-3"
                                    data-dismiss="fileinput"
                                    onClick={this.handleRemoveFiledefaultImage}
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
                        <Col md={4}>
                          <FormGroup className="text-center font-weight-bold mb-12">
                            <Label for="input-name">
                              {i18next.t("Restaurant Details Cover Image")}
                            </Label>
                            <div>
                              <div
                                className="fileinput fileinput-new"
                                dataprovider="fileinput"
                              >
                                <center>
                                  <div
                                    className="fileinput-preview img-thumbnail"
                                    style={{ width: "200px", height: "140px" }}
                                  >
                                    <img
                                      src={
                                        restuarantCoverImage.length !== 0
                                          ? restuarantCoverImage
                                          : restuarantCoverImageprev
                                      }
                                      style={{
                                        width: "190px",
                                        height: "130px",
                                        objectFit: "cover",
                                      }}
                                    />
                                  </div>
                                </center>
                              </div>
                              <div>
                                <span className="btn btn-outline-secondary btn-file mt-3">
                                  {restuarantCoverImage.length === 0 ? (
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
                                    name="restuarantCoverImage"
                                    onChange={
                                      this.handleFileChangerestuarantCoverImage
                                    }
                                    accept="image/x-png,image/gif,image/jpeg"
                                  />
                                </span>
                                {restuarantCoverImage.length !== 0 && (
                                  <button
                                    className="btn btn-outline-secondary fileinput-exists mt-3"
                                    data-dismiss="fileinput"
                                    onClick={
                                      this.handleRemoveFilerestuarantCoverImage
                                    }
                                  >
                                    {i18next.t("Remove")}
                                  </button>
                                )}
                              </div>
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                      <div className="text-center my-4">
                        <Button
                          className="my-3"
                          color="success"
                          type="button"
                          onClick={this.handleSubmitDImages}
                        >
                          {i18next.t("save")}
                        </Button>
                      </div>
                    </TabPane>
                    <TabPane tabId={3}>
                      <Form>
                        <h6 className="heading-small text-muted mb-4">
                          {i18next.t("SOCIAL LINKS")}
                        </h6>
                        <Row>
                          <Col md="12">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-sitename"
                              >
                                {i18next.t("Facebook")}
                              </label>
                              <Input
                                className="form-control-alternative"
                                type="test"
                                name="facebook"
                                value={this.state.facebook}
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
                                htmlFor="input-sitename"
                              >
                                {i18next.t("Instagram")}
                              </label>
                              <Input
                                className="form-control-alternative"
                                type="test"
                                name="instagram"
                                value={this.state.instagram}
                                onChange={(e) => this.handleChange(e)}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <h6 className="heading-small text-muted mb-4">
                          {i18next.t("MOBILE APP")}
                        </h6>
                        <Row>
                          <Col md="12">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-sitename"
                              >
                                {i18next.t("Info Title")}
                              </label>
                              <Input
                                className="form-control-alternative"
                                type="test"
                                name="infoTitle"
                                value={this.state.infoTitle}
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
                                htmlFor="input-sitename"
                              >
                                {i18next.t("Info Subtitle")}
                              </label>
                              <Input
                                className="form-control-alternative"
                                type="test"
                                name="infoSubTitle"
                                value={this.state.infoSubTitle}
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
                                htmlFor="input-sitename"
                              >
                                {i18next.t("Play Store")}
                              </label>
                              <Input
                                className="form-control-alternative"
                                type="test"
                                name="playStore"
                                value={this.state.playStore}
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
                                htmlFor="input-sitename"
                              >
                                {i18next.t("App Store")}
                              </label>
                              <Input
                                className="form-control-alternative"
                                type="test"
                                name="appStore"
                                value={this.state.appStore}
                                onChange={(e) => this.handleChange(e)}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <center>
                          <Button
                            className="my-4"
                            color="success"
                            type="button"
                            onClick={this.UpdateLinkData}
                          >
                            {i18next.t("save")}
                          </Button>
                        </center>
                      </Form>
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </div>
          </Row>
          <NotificationContainer />
        </Container>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Setting);
