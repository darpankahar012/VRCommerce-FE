import React, { Component } from "react";
import classnames from "classnames";
import i18next from "i18next";
import { Link } from "react-router-dom";

import { Dropdown } from "semantic-ui-react";

// for api integration
import instance from "../../../../axios";
import requests from "../../../../requests";

// for Redux
import { bindActionCreators } from "redux";
import { ActCreators } from "../../../../redux/bindActionCreator";
import { connect } from "react-redux";

// for notification
import "react-notifications/lib/notifications.css";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

// inner Component
import Workinghourse from "../../../Owner/Restaurants/Workinghourse";
import Loader from "../../../common/Loader";
import Sidebar from "../../../Sidebar/Sidebar";
import Navbar from "../../../Navbars/AdminNavbar";
import routes from "../../../../routes.js";

import {
  Map,
  TileLayer,
  Marker,
  Popup,
  FeatureGroup,
  Polygon,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
// import "../../../node_modules/leaflet-draW/dist/leaflet-draw";
import mapLogo from "../../../../assets/img/icons/common/Map-Pin.svg";

// reactstrap components
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  Button,
  CardBody,
  Form,
  FormGroup,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";

// restaurants css file
import "../../../Owner/Restaurants/Restaurants";

// import aws from "../../../components/AWS/"
import Axios from "axios";

let token = null;
let ownerprofileupdate = {};
let userData = {};
let getownerprofile = {};
let GetcityListWithId = {};
let StoreRestaurantId = {};
let polyGone = [];

const mapStateToProps = (state) => {
  token = state.token;
  ownerprofileupdate = state.ownerprofileupdate;
  userData = state.userData;
  getownerprofile = state.getownerprofile;
  GetcityListWithId = state.GetcityListWithId;
  StoreRestaurantId = state.StoreRestaurantId;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};

export class Restaurants extends Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.state = {
      tabs: 1,
      location: {
        type: "Point",
        coordinates: [-25.5577, -63.8535],
      },
      day: [
        {
          isChecked: false,
          weekDay: 0,
          openingTime: "12:00",
          closingTime: "12:00",
        },
        {
          isChecked: false,
          _id: "5f7560c75e307a42445cbdd7",
          weekDay: 1,
          openingTime: "12:00",
          closingTime: "12:00",
        },
        {
          isChecked: false,
          _id: "5f7560c75e307a42445cbdd8",
          weekDay: 2,
          openingTime: "12:00",
          closingTime: "12:00",
        },
        {
          isChecked: false,
          _id: "5f7560c75e307a42445cbdd9",
          weekDay: 3,
          openingTime: "12:00",
          closingTime: "12:00",
        },
        {
          isChecked: false,
          _id: "5f7560c75e307a42445cbdda",
          weekDay: 4,
          openingTime: "12:00",
          closingTime: "12:00",
        },
        {
          isChecked: false,
          _id: "5f7560c75e307a42445cbddb",
          weekDay: 5,
          openingTime: "12:00",
          closingTime: "12:00",
        },
        {
          isChecked: false,
          _id: "5f7560c75e307a42445cbddc",
          weekDay: 6,
          openingTime: "12:00",
          closingTime: "12:00",
        },
      ],
      resturantName: "",
      resturantDescription: "",
      resturantAddress: "",
      clientCity: "",
      minimumorder: null,
      image: "",
      coverImage: "",
      LoaderShow: true,
      fee_percent: null,
      static_fee: null,
      IsFeatured: false,
      AccountID: null,
      QRCode:"",
    };
  }

  toggleNavs = (e, state, index) => {
    e.preventDefault();

    this.setState(
      {
        [state]: index,
      },
      () => {
        if (index === 2) {
          const map = this.mapRef.current.leafletElement;
          map.invalidateSize();
        }
      }
    );
  };

  getIcon = (iSize) => {
    return L.icon({
      iconUrl: mapLogo,
      iconSize: [iSize],
    });
  };

  // addMarker = (e) => {
  //   const newMarker = e.latlng;
  //   const mcord = {
  //     type: "Point",
  //     coordinates: [newMarker.lat, newMarker.lng],
  //   };
  //   this.setState({ location: mcord });
  // };

  eventHandlersGetLOcation = (e) => {
    const newMarker = e.target._latlng;
    const mcord = {
      type: "Point",
      coordinates: [newMarker.lat, newMarker.lng],
    };
    this.setState({ location: mcord });
  };

  handlechangeall = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    this.setState({
      [e.target.name]: value,
    });
  };

  handleWorkingHours = (value, i, type) => {
    const days = Object.assign([], this.state.day);
    days[i][type] = value;

    this.setState({ day: days });
  };

  handleFileChange = async (e, id) => {
    const filedata = e.target.files[0];
    const fd = new FormData();
    fd.append("restaurant_image", filedata, filedata.name);
    fd.append("userid", id);
    const response = await instance
      .post(requests.fetchAddrestViaAdminImage, fd, {
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
      this.getOwnerUserProfile();
    }
  };
  handlecoverFileChange = async (e, id) => {
    const filedata = e.target.files[0];
    const fd = new FormData();
    fd.append("restaurant_cover_image", filedata, filedata.name);
    fd.append("userid", id);
    const response = await instance
      .post(requests.fetchAddrestViaAdminImage, fd, {
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
      this.getOwnerUserProfile();
    }
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
    const rm = Object.assign({}, this.state.RestaurantManagement);
    rm.image = "";
    this.setState({ RestaurantManagement: rm });
  };

  handleRemoveFile = (e) => {
    e.preventDefault();
    this.setState({ image: "" });
  };

  handleRemoveCoverFile = (e) => {
    e.preventDefault();
    this.setState({ coverImage: "" });
  };

  onUpdateOwnerProfile = async () => {
    const {
      resturantAddress,
      resturantDescription,
      clientCity,
      resturantName,
      day,
      minimumorder,
      location,
      name,
      email,
      phone,
      fee_percent,
      static_fee,
      IsFeatured,
      AccountID,
      resturantLandmark,
    } = this.state;

    let UpdateOwnerProfile = {
      user_id: StoreRestaurantId.id,
      name: name,
      email: email,
      phone: phone,
      address: [
        {
          landmark: resturantLandmark,
          user_address: resturantAddress,
        },
      ],
      location: location,
      fee_percent: fee_percent,
      static_fee: static_fee,
      raz_account_id: AccountID,
      delivery_area: this.state.delivery_area,
      Working_hours: this.state.day,
      restaurant_Name: resturantName,
      restaurant_Description: resturantDescription,
      restaurant_city: clientCity,
      restaurant_Minimum_order: minimumorder,
      IsFeatured: IsFeatured,
    };

    const response = await instance
      .patch(requests.fetchUpdateOwnerProfileByAdmin, UpdateOwnerProfile, {
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
      let ownerData = response.data.data;
      this.props.OWNER_PROFILE_UPDATE(ownerData);
      this.getOwnerUserProfile();
    }
  };

  handleSelectChange = (e, data) => {
    this.setState({
      [data.name]: data.value,
    });
  };

  download = async (QRCode) => {
    Axios({
      url:QRCode,
      method: 'GET',
      responseType: 'blob',
      withCredentials: false,
    }).then((response) => {
      console.log("Response = ",response)
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type:response.headers['content-type']
        }));
      const link = document.createElement('a');
      link.href = url
      link.setAttribute('download','image.png');
      document.body.appendChild(link)
      link.click();
    }).catch((error) => {
      console.log("Error = ",error)
    });
  };

  getOwnerUserProfile = async () => {
    const response = await instance
      .get(requests.fetchGetUserProfileData + "/" + StoreRestaurantId.id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.error.message;
        NotificationManager.error(errorMessage);
      });
    if (response && response.data) {
      console.log("QR Code ==> ",response)
      const cityI = response.data.data.cities;
      this.props.GET_CITY_LIST_WITH_ID(cityI);
      const Initialdata = {
        day: [
          {
            isChecked: false,
            weekDay: 0,
            openingTime: "",
            closingTime: "",
          },
          {
            isChecked: false,
            _id: "5f7560c75e307a42445cbdd7",
            weekDay: 1,
            openingTime: "",
            closingTime: "",
          },
          {
            isChecked: false,
            _id: "5f7560c75e307a42445cbdd8",
            weekDay: 2,
            openingTime: "",
            closingTime: "",
          },
          {
            isChecked: false,
            _id: "5f7560c75e307a42445cbdd9",
            weekDay: 3,
            openingTime: "",
            closingTime: "",
          },
          {
            isChecked: false,
            _id: "5f7560c75e307a42445cbdda",
            weekDay: 4,
            openingTime: "",
            closingTime: "",
          },
          {
            isChecked: false,
            _id: "5f7560c75e307a42445cbddb",
            weekDay: 5,
            openingTime: "",
            closingTime: "",
          },
          {
            isChecked: false,
            _id: "5f7560c75e307a42445cbddc",
            weekDay: 6,
            openingTime: "",
            closingTime: "",
          },
        ],
      };

      const cd = [];
      const city_data =
        response.data.data.hasOwnProperty("cities") === true
          ? response.data.data.cities.map((Dd, i) => {
              cd[i] = {
                value: Dd._id,
                key: Dd.city_name,
                text: Dd.city_name,
              };
            })
          : [{ value: "", label: "", key: "" }];

      this.setState(
        {
          resturantAddress:
            response.data.data.user.hasOwnProperty("address") === true
              ? response.data.data.user.address.length === 0
                ? ""
                : response.data.data.user.address[0].user_address
              : "",
          country_code: response.data.data.user?.country_code,
          resturantLandmark:
            response.data.data.user.address.length === 0
              ? ""
              : response.data.data.user.address[0].landmark,
          resturantDescription:
            response.data.data.user.hasOwnProperty("restaurant_Description") ===
            true
              ? response.data.data.user.restaurant_Description
              : "",
          clientCity:
            response.data.data.user.hasOwnProperty("restaurant_city") === true
              ? response.data.data.user.restaurant_city.length > 0
                ? response.data.data.user.restaurant_city
                : ""
              : "",
          resturantName:
            response.data.data.user.hasOwnProperty("restaurant_Name") === true
              ? response.data.data.user.restaurant_Name.length > 0
                ? response.data.data.user.restaurant_Name
                : ""
              : "",
          day:
            response.data.data.user.hasOwnProperty("Working_hours") === true
              ? response.data.data.user.Working_hours
              : Initialdata.day,

          minimumorder:
            response.data.data.user.restaurant_Minimum_order === undefined
              ? ""
              : response.data.data.user.restaurant_Minimum_order,
          location:
            response.data.data.user.hasOwnProperty("location") === true
              ? response.data.data.user.location
              : {},
          name: response.data.data.user.name,
          phone: response.data.data.user.phone,
          email: response.data.data.user.email,
          delivery_area:
            response.data.data.user.hasOwnProperty("delivery_area") === true
              ? response.data.data.user.delivery_area
              : {},
          Cities: cd,
          // response.data.data.hasOwnProperty("cities") === true
          //   ? response.data.data.cities
          //   : [],
          fee_percent: response.data.data.user.fee_percent,
          static_fee: response.data.data.user.static_fee,
          AccountID: response.data.data.user?.raz_account_id,
          IsFeatured: response.data.data.user.IsFeatured,
          imagePrev:
            response.data.data.user.hasOwnProperty("restaurant_image") === true
              ? `${response.data.data.user.restaurant_image.image_url}`
              : process.env.REACT_APP_DEFAULT_IMAGE,
          coverImagePrev:
            response.data.data.user.hasOwnProperty("restaurant_cover_image") ===
            true
              ? `${response.data.data.user.restaurant_cover_image.image_url}`
              : process.env.REACT_APP_DEFAULT_IMAGE,
          QRCode:
            response.data.data.user.hasOwnProperty("qrcode") === true
              ? `${response.data.data.user.qrcode}`
              : process.env.REACT_APP_DEFAULT_IMAGE,    
        },
        () => {
          this.setState({ LoaderShow: false });
        }
      );
    }
  };

  storeOwnerId = () => {
    this.props.STORE_RESTAURANT(StoreRestaurantId.id);
  };

  addEditPolyGon = () => {
    if (this.mapRef && this.mapRef.current) {
      const map = this.mapRef.current.leafletElement;

      /** Add the feature group and draw control to the map. */
      let drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);
      const drawControl = new L.Control.Draw({
        position: "topright",
        draw: {
          polyline: false,
          rectangle: false,
          circlemarker: false,
          polygon: true,
          circle: false,
          marker: false,
        },
        edit: {
          featureGroup: drawnItems,
          remove: true,
        },
      });
      map.addControl(drawControl);
      map.on(L.Draw.Event.CREATED, (e, i) => {
        const type = e.layerType;
        const layer = e.layer;
        // if (type === "marker") {
        //   layer.bindPopup("popup");
        // }
        drawnItems.addLayer(layer);

        const geoJSON = drawnItems.toGeoJSON();
        const layers = drawnItems.getLayers();
        geoJSON.features.map((poly, i) => {
          polyGone[i] = poly.geometry.coordinates;
        });

        const data = {
          type: "MultiPolygon",
          coordinates: polyGone,
        };
        this.setState({
          delivery_area: data,
        });
      });

      map.on(L.Draw.Event.DELETED, (e, i) => {
        const type = e.layerType;
        const layer = e.layer;
        // if (type === "marker") {
        //   layer.bindPopup("popup");
        // }

        const geoJSON = drawnItems.toGeoJSON();
        const layers = drawnItems.getLayers();

        const a = [];
        geoJSON.features.map((poly, i) => {
          a[i] = poly.geometry.coordinates;
        });

        polyGone = a;

        const data = {
          type: "MultiPolygon",
          coordinates: polyGone,
        };

        this.setState({
          delivery_area: data,
        });
      });

      map.on(L.Draw.Event.EDITED, (e) => {
        const layers = e.layers;
        let countOfEditedLayers = 0;
        layers.eachLayer((layer) => {
          countOfEditedLayers++;
        });
        const geoJSON = drawnItems.toGeoJSON();

        geoJSON.features.map((poly, i) => {
          polyGone[i] = poly.geometry.coordinates;
          const data = {
            type: "MultiPolygon",
            coordinates: polyGone,
          };
          this.setState({
            delivery_area: data,
          });
        });
      });

      this.setState({ map: map });
    }
  };

  componentDidMount = () => {
    this.getOwnerUserProfile();
    this.addEditPolyGon();
  };

  clearPolygon = () => {
    const data = {
      type: "MultiPolygon",
      coordinates: polyGone,
    };
    this.setState({
      delivery_area: data,
    });
  };

  render() {
    const {
      resturantName,
      resturantDescription,
      resturantAddress,
      clientCity,
      minimumorder,
      image,
      coverImage,
      day,
      location,
      Cities,
      LoaderShow,
      name,
      phone,
      email,
      fee_percent,
      static_fee,
      IsFeatured,
      AccountID,
      coverImagePrev,
      imagePrev,
      resturantLandmark,
      country_code,
      QRCode
    } = this.state;
    console.log(country_code)
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
          {/* <Header /> */}
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
              <Loader open={this.state.LoaderShow} />
              <Col xs={12} sm="12 mb-4" xl={6} className="card-left ">
                <Card className="bg-secondary shadow">
                  <CardHeader className="bg-white border-0">
                    <Row className="align-items-center">
                      <Col xs="6">
                        <h3 className="mb-0">
                          {i18next.t("Restaurant Management")}{" "}
                        </h3>
                      </Col>
                      <Col className="text-right" xs="6">
                        <Link to={`/restaurants`}>
                          <Button color="primary" size="sm">
                            {i18next.t("Back to List")}
                          </Button>
                        </Link>

                        <Link to={`/restaurant/${resturantName}`}>
                          <Button
                            color="primary"
                            size="sm"
                            className="ml-2"
                            onClick={this.storeOwnerId}
                          >
                            {i18next.t("View it")}
                          </Button>
                        </Link>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <div className="pl-lg-4 px-lg-4">
                      <Form>
                        {country_code === "in" ? (
                          <>
                            <h6 className="heading-small text-muted mb-4">
                              {i18next.t("RESTAURANT ACCOUNT INFORMATION")}
                            </h6>
                            <FormGroup>
                              <Label
                                className="mb-2 font-weight-bold"
                                for="resturantAccountID"
                              >
                                {i18next.t("Razorpay Account ID")}
                              </Label>
                              <Input
                                className="px-2 py-4"
                                type="text"
                                placeholder={i18next.t("Razorpay Account ID")}
                                name="AccountID"
                                value={AccountID}
                                onChange={this.handlechangeall}
                              />
                            </FormGroup>
                          </>
                        ) : null}
                        <h6 className="heading-small text-muted mb-4">
                          {i18next.t("RESTAURANT INFORMATION")}
                        </h6>
                        <FormGroup>
                          <Label
                            className="mb-2 font-weight-bold"
                            for="resturantName"
                          >
                            {i18next.t("Restaurant Name")}
                          </Label>
                          <Input
                            className="px-2 py-4"
                            type="text"
                            placeholder={i18next.t("Restaurant Name")}
                            name="resturantName"
                            value={resturantName}
                            onChange={this.handlechangeall}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label
                            className="mb-2 font-weight-bold"
                            for="Restaurant Description"
                          >
                            {i18next.t("Restaurant Description")}
                          </Label>
                          <Input
                            className="px-2 py-4"
                            type="text"
                            placeholder={i18next.t("Restaurant Description")}
                            name="resturantDescription"
                            value={resturantDescription}
                            onChange={this.handlechangeall}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label
                            className="mb-2 font-weight-bold"
                            for="resturantAddress"
                          >
                            {i18next.t("Restaurant Address")}
                          </Label>
                          <Input
                            className="px-2 py-4"
                            type="text"
                            placeholder={i18next.t("Restaurant Address")}
                            name="resturantAddress"
                            value={resturantAddress}
                            onChange={this.handlechangeall}
                          />
                        </FormGroup>
                         {" "}
                        <FormGroup>
                          <Label
                            className="mb-2 font-weight-bold"
                            for="landmark"
                          >
                            {i18next.t("Restaurant Landmark")}
                          </Label>
                          <Input
                            className="px-2 py-4"
                            type="text"
                            placeholder={i18next.t("Restaurant landmark")}
                            name="resturantLandmark"
                            value={resturantLandmark}
                            onChange={this.handlechangeall}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label className="mb-2 font-weight-bold" for="client">
                            {i18next.t("Restaurant city")}
                          </Label>
                          <Dropdown
                            placeholder={i18next.t("Select Client")}
                            fluid
                            search
                            selection
                            clearable
                            name="clientCity"
                            options={this.state.Cities}
                            onChange={this.handleSelectChange}
                            value={this.state.clientCity}
                            // name="client"
                          />
                          {/* <Input
                            type="select"
                            name="clientCity"
                            id="client"
                            value={clientCity}
                            onChange={this.handlechangeall}
                          >
                            <option value="" disable>
                              {" "}
                              Select Restaurant City
                            </option>
                            {LoaderShow === false &&
                              Cities.map((city) => {
                                return (
                                  <option value={city._id}>
                                    {city.city_name}
                                  </option>
                                );
                              })}
                          </Input> */}
                        </FormGroup>
                        <FormGroup>
                          <Label
                            className="mb-2 font-weight-bold"
                            for="minimumorder"
                          >
                            {i18next.t("Minimum order")}
                          </Label>
                          <Input
                            className="px-2 py-4"
                            type="number"
                            placeholder={i18next.t("Enter Minimum Order Value")}
                            name="minimumorder"
                            value={minimumorder}
                            onChange={this.handlechangeall}
                          />
                        </FormGroup>
                        <Row>
                          <Col md={6}>
                            <FormGroup>
                              <Label
                                className="mb-2 font-weight-bold"
                                for="fee_percent"
                              >
                                {i18next.t("Fee percent")}
                              </Label>
                              <Input
                                className="px-2 py-4"
                                type="number"
                                placeholder={i18next.t("Enter fee_percent")}
                                name="fee_percent"
                                value={fee_percent}
                                onChange={this.handlechangeall}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={6}>
                            <FormGroup>
                              <Label
                                className="mb-2 font-weight-bold"
                                for="static_fee"
                              >
                                {i18next.t("Static fee")}
                              </Label>
                              <Input
                                className="px-2 py-4"
                                type="number"
                                placeholder={i18next.t("Enter static_fee")}
                                name="static_fee"
                                value={static_fee}
                                onChange={this.handlechangeall}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={6} className="my-4 ">
                            <Label
                              className="mb-2 font-weight-bold"
                              for="IsFeatured"
                            >
                              {i18next.t("Is Featured")}
                            </Label>
                          </Col>
                          <Col
                            md={6}
                            className="text-right "
                            style={{ margin: "auto 0" }}
                          >
                            {IsFeatured === false ? (
                              <label className="custom-toggle">
                                <input
                                  type="checkbox"
                                  name="IsFeatured"
                                  value={IsFeatured}
                                  onChange={this.handlechangeall}
                                />
                                <span className="custom-toggle-slider rounded-circle" />
                              </label>
                            ) : (
                              <label className="custom-toggle">
                                <input
                                  defaultChecked
                                  type="checkbox"
                                  name="IsFeatured"
                                  value={IsFeatured}
                                  onChange={this.handlechangeall}
                                />
                                <span className="custom-toggle-slider rounded-circle" />
                              </label>
                            )}
                          </Col>
                        </Row>
                        <Row>
                          <Col md={6}>
                            <FormGroup className="text-center font-weight-bold mb-6">
                              <Label for="input-name">
                                {i18next.t("Restaurant Image")}
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
                                      onChange={(e) => {
                                        this.handleFileChange(
                                          e,
                                          StoreRestaurantId.id
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
                          <Col md={6}>
                            <FormGroup className="text-center font-weight-bold mb-6">
                              <Label for="input-name">
                                {i18next.t("Restaurant Cover Image")}
                              </Label>
                              <div className="text-center">
                                <div
                                  className="fileinput fileinput-new"
                                  dataprovider="fileinput"
                                >
                                  <div className="fileinput-preview img-thumbnail">
                                    <img
                                      src={
                                        coverImage.length !== 0
                                          ? coverImage
                                          : coverImagePrev
                                      }
                                      style={{
                                        width: "90%",
                                        height: "100px",
                                        objectFit: "cover",
                                      }}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <span className="btn btn-outline-secondary btn-file mt-3">
                                    {coverImage.length === 0 ? (
                                      <span className="fileinput-new">
                                        {i18next.t("Upload image")}
                                      </span>
                                    ) : (
                                      <span className="fileinput-exists">
                                        {i18next.t("Change")}
                                      </span>
                                    )}
                                    <input
                                      type="hidden"
                                      value=""
                                      name="resto_logo"
                                    />
                                    <input
                                      onChange={(e) => {
                                        this.handlecoverFileChange(
                                          e,
                                          StoreRestaurantId.id
                                        );
                                      }}
                                      type="file"
                                      name=""
                                      accept="image/x-png,image/gif,image/jpeg"
                                    />
                                  </span>
                                  {coverImage.length !== 0 && (
                                    <button
                                      className="btn btn-outline-secondary fileinput-exists mt-3"
                                      data-dismiss="fileinput"
                                      onClick={this.handleRemoveCoverFile}
                                    >
                                      {i18next.t("Remove")}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </FormGroup>
                          </Col>
                        </Row>
                      </Form>
                    </div>

                    <hr className="my-4" />

                    <h6 className="heading-small text-muted mb-4">
                      {i18next.t("Owner information")}
                    </h6>
                    <div className="pl-lg-4 px-lg-4">
                      <FormGroup className="focused">
                        <Label
                          className="mb-2 font-weight-bold "
                          for="OwnerName  "
                        >
                          {i18next.t("Owner Name")}
                        </Label>
                        <Input
                          className="px-2 py-4 form-control-alternative"
                          type="text"
                          placeholder={i18next.t("Owner Name")}
                          name="OwnerName"
                          value={name}
                          readOnly
                        />
                      </FormGroup>

                      <FormGroup className="focused">
                        <Label
                          className="mb-2 font-weight-bold "
                          for="OwnerName  "
                        >
                          {i18next.t("Owner Email")}
                        </Label>
                        <Input
                          className="px-2 py-4 form-control-alternative"
                          type="email"
                          placeholder={i18next.t("Owner Email")}
                          name="OwnerEmail"
                          value={email}
                          readOnly
                        />
                      </FormGroup>

                      <FormGroup className="focused">
                        <Label
                          className="mb-2 font-weight-bold "
                          for="OwnerName  "
                        >
                          {i18next.t("Owner Phone")}
                        </Label>
                        <Input
                          className="px-2 py-4 form-control-alternative"
                          type="text"
                          placeholder={i18next.t("Owner Phone")}
                          name="OwnerPhone"
                          value={phone}
                          readOnly
                        />
                      </FormGroup>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col className="card-right" xs={12} sm={12} xl={6}>
                <Card className="card-profile shadow">
                  <CardHeader className="bg-white border-0">
                    <Row className="align-items-center">
                      <Col xs="8">
                        <h2 className="mb-0">
                          {i18next.t("Restaurant Location")}
                        </h2>
                      </Col>
                    </Row>
                  </CardHeader>
                  <hr className="my-1" />
                  <CardBody className="pt-0 pt-md-4">
                    <div className="nav-wrapper">
                      <Nav
                        className="nav-fill flex-column flex-md-row px-2"
                        id="tabs-icons-text"
                        pills
                        role="tablist"
                      >
                        <NavItem>
                          <NavLink
                            aria-selected={this.state.tabs === 1}
                            className={classnames("mb-sm-3 mb-md-0 btn", {
                              active: this.state.tabs === 1,
                            })}
                            onClick={(e) => this.toggleNavs(e, "tabs", 1)}
                            role="tab"
                          >
                            {i18next.t("Location")}
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            aria-selected={this.state.tabs === 2}
                            className={classnames("mb-sm-3 mb-md-0 btn", {
                              active: this.state.tabs === 2,
                            })}
                            onClick={(e) => {
                              this.toggleNavs(e, "tabs", 2);
                            }}
                            role="tab"
                          >
                            {i18next.t("Delivery Area")}
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </div>
                    <Card className="shadow mt-4 mx-2">
                      <CardBody>
                        <TabContent activeTab={`tabs${this.state.tabs}`}>
                          <TabPane tabId="tabs1">
                            <Map
                              center={
                                this.state.location.coordinates
                                  ? location.coordinates
                                  : [21.1702, 72.8311]
                              }
                              zoom={13}
                              style={{ height: "33rem", width: "100%" }}
                              ref={this.mapRef}
                              scrollWheelZoom={false}
                            >
                              <TileLayer
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              />
                              {LoaderShow === false && (
                                <>
                                  {this.state.location.coordinates ? (
                                    <Marker
                                      position={location.coordinates}
                                      icon={this.getIcon()}
                                      zIndexOffset={1000}
                                      draggable={true}
                                      onDragend={this.eventHandlersGetLOcation}
                                    />
                                  ) : (
                                    <Marker
                                      position={[21.1702, 72.8311]}
                                      draggable={true}
                                      onDragend={this.eventHandlersGetLOcation}
                                      icon={this.getIcon()}
                                      zIndexOffset={1000}
                                    />
                                  )}
                                </>
                              )}
                            </Map>
                          </TabPane>
                          <TabPane tabId="tabs2">
                            <Map
                              center={
                                this.state.location === {}
                                  ? [21.1702, 72.8311]
                                  : location.coordinates
                              }
                              zoom={13}
                              style={{ height: "33rem", width: "100%" }}
                              ref={this.mapRef}
                              scrollWheelZoom={false}
                            >
                              <TileLayer
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              />
                              {LoaderShow === false &&
                                this.state.location.coordinates && (
                                  <Marker
                                    position={location.coordinates}
                                    icon={this.getIcon()}
                                    zIndexOffset={1000}
                                  />
                                )}
                              {LoaderShow === false &&
                                this.state.delivery_area.coordinates && (
                                  <Polygon
                                    positions={
                                      this.state.delivery_area.coordinates
                                    }
                                    zIndexOffset={1000}
                                    color="blue"
                                  />
                                )}
                            </Map>
                            <Button
                              block
                              color="danger"
                              size="lg"
                              type="button"
                              className="mt-4 p-2"
                              onClick={this.clearPolygon}
                            >
                              Clear Delivery Area
                            </Button>
                          </TabPane>
                        </TabContent>
                      </CardBody>
                    </Card>
                  </CardBody>
                </Card>

                <br />

                <Card className="card-profile shadow">
                  <CardHeader className="bg-white border-0">
                    <Row className="align-items-center">
                      <Col xs="8">
                        <h2 className="mb-0">{i18next.t("Working Hours")}</h2>
                      </Col>
                    </Row>
                  </CardHeader>
                  <hr className="my-1" />
                  <CardBody className="pt-0 pt-md-4">
                    <Form>
                      <FormGroup>
                        <br />
                        {this.state.day.map((day, i) => {
                          return (
                            <Workinghourse
                              key={i}
                              i={i}
                              data={day}
                              handleWorkingHours={this.handleWorkingHours}
                            />
                          );
                        })}
                      </FormGroup>
                    </Form>
                  </CardBody>
                </Card>
                <br />
                <Card className="card-profile shadow">
                  <CardHeader className="bg-white border-0">
                    <Row className="align-items-center">
                      <Col xs="8">
                        <h2 className="mb-0">{i18next.t("QR code")}</h2>
                      </Col>
                    </Row>
                  </CardHeader>
                  <hr className="my-1" />
                  <CardBody className="pt-0 pt-md-4">
                    <Form>
                      <FormGroup>
                        <br />
                        <div className="text-center">
                          <img
                            src={QRCode}
                            style={{
                              width: "50%",
                              height: "50%",
                            }}
                          />
                          <br />
                          <Button
                            color="primary"
                            download
                            onClick = {() => {this.download(QRCode)}}
                          >
                            <i className="fa fa-download" />
                            &nbsp; Download
                          </Button>
                        </div>
                        
                      </FormGroup>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <div className="text-center">
              <button
                type="submit"
                className="btn btn-success px-4 py-3 my-6"
                onClick={this.onUpdateOwnerProfile}
              >
                {i18next.t("save")}
              </button>
            </div>

            <NotificationContainer />
          </Container>
        </div>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Restaurants);
