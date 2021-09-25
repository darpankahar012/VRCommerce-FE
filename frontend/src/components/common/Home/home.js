import React from "react";
import instance from "../../../axios";
import requests from "../../../requests";
import i18next from "i18next";
import "react-notifications/lib/notifications.css";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import HomeHeader from "../header/HomeHeader.js";
import "components/common/Home/home.css";
// import logo from '../../../assets/img/theme/Food-3.png';
// import backgroundImage from 'assets/img/theme/food-1.jpg'
import sideImage from "../../../assets/img/theme/food-8.webp";
import imge from "../../../assets/img/theme/Food-2.png";
import { Link } from "react-router-dom";

import { bindActionCreators } from "redux";
import { ActCreators } from "../../../redux/bindActionCreator";
import { connect } from "react-redux";

// Plastore Image
import playstore from "../../../assets/img/theme/play_store.png";

// Footer
import HomeFooter from "components/Footers/HomeFooter";

import { Row, Col, Container } from "reactstrap";

import { Dropdown } from "semantic-ui-react";

let userData = {};
let token = null;

const mapStateToProps = (state) => {
  userData = state.userData;
  token = state.token;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: [],
      Restaurants: [],
      searchBox: "",
      flag: true,
      siteName: "",
      siteDesc: "",
      headerTitle: "",
      headerSubTitle: "",
      facebook: "",
      instagram: "",
      infoTitle: "",
      infoSubTitle: "",
      playStore: "",
      appStore: "",
      country: [],
      selectedCountry: null,
      cityOB:[],
      selectedCity:null,
      selectedCityDetail:{},
      showSelectedCity:false
    };
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  handleSelectChange = (e, data) => {
    this.setState({
      [data.name]: data.value,
    });
  };
  getSiteInfo = async () => {
    // Site Information API Integration
    let SiteId = {
      site_id: "5f896cf681eb0371e0dfba39",
    };
    const response1 = await instance
      .post(requests.fetchSiteInfoForClient, SiteId)
      .catch((error) => {
        let errorMessage = error.response1.data.error.message;
        NotificationManager.error(errorMessage);
      });
    if (response1 && response1.data) {
      this.setState({
        siteName: response1.data.data.siteInfo.site_Name,
        siteDesc: response1.data.data.siteInfo.site_Description,
        headerTitle: response1.data.data.siteInfo.title,
        headerSubTitle: response1.data.data.siteInfo.subtitle,
      });
    }
  };
  GetCountry = async () => {
    const response = await instance
      .get(requests.fetchCountry)
      .catch((error) => {
        let errorMessage = error.response.data.error.message;
        NotificationManager.error(errorMessage);
      });
    if (response && response.data) {
      response.data.data !== null &&
        response.data.data.map((item, i) => {
          let countryOB = {
            value: item,
            key: item,
            text: item,
          };
          this.state.country.push(countryOB);
        });
    }
  };
  GetCityWithoutToken = async () => {
    let bodyAPI = {
      country_name: this.state.selectedCountry,
    };
    const response = await instance
      .post(requests.fetchCityOnHome, bodyAPI)
      .catch((error) => {
        let errorMessage = error.response.data.error.message;
        //NotificationManager.error(errorMessage)
      });
    if (response && response.data) {
      this.setState({
        city: response.data.data.cities,
      })
      console.log("City Res = ",response.data.data.cities)
      response.data.data.cities.map((item, i) => {
        console.log("City Name = ",item.city_name)
        let cityOB = {
          value: item._id,
          key: item.city_name,
          text: item.city_name,
          image: { huge:true,rounded: true, src: item.city_image.image_url },
        };
        this.state.cityOB.push(cityOB);
      });
    }
  };
  GetCityWithToken = async () => {
    let bodyAPI = {
      country_name: userData.country_name,
    };
    const response = await instance
      .post(requests.fetchCityOnHome, bodyAPI)
      .catch((error) => {
        let errorMessage = error.response.data.error.message;
        NotificationManager.error(errorMessage);
      });
    if (response && response.data) {
      this.setState({
        city: response.data.data.cities,
      });
      response.data.data.cities.map((item, i) => {
        console.log("City Name = ",item.city_name)
        let cityOB = {
          value: item._id,
          key: item.city_name,
          text: item.city_name,
          image: { huge:true,rounded: true, src: item.city_image.image_url },
        };
        this.state.cityOB.push(cityOB);
      });
    }
  };

  FindYourCity = async () => {
    console.log("Selected City = ",this.state.selectedCity)
    const response = await instance.get(requests.fetchCityDetail+this.state.selectedCity ).catch((error) => {
      let errorMessage = error.response.data.error.message;
      NotificationManager.error(errorMessage)
    });
    if (response && response.data) {
        console.log("Response Of City => ",response.data.data.city);
        this.setState({
          showSelectedCity:true,
          selectedCityDetail: response.data.data.city,
        },() => {
          console.log("City Resd => ",this.state.selectedCityDetail)
        });
    }
  }

  componentDidMount = async () => {
    // this.GetCountry();
    // this.getSiteInfo();
    // if (token === null) {
    //   if (this.state.selectedCountry === null) {
    //     this.GetCityWithoutToken();
    //   }
    //   else {
    //       return null;
    //   }
    // } else {
    //     if(userData.hasOwnProperty('country_name') === true){
    //         this.GetCityWithToken();
    //     }
    //     else {
    //         return null;
    //     }
    // }

    // Links Information API Integration
    // let LinkId = {
    //   link_id: "5f883e12f467716db0d5b5fc",
    // };
    // const responseOfLinkInfo = await instance
    //   .post(requests.fetchLinkDataForClient, LinkId)
    //   .catch((error) => {
    //     let errorMessage = error.responseOfLinkInfo.data.error.message;
    //     NotificationManager.error(errorMessage);
    //   });
    // if (responseOfLinkInfo && responseOfLinkInfo.data) {
    //   this.setState({
    //     infoTitle: responseOfLinkInfo.data.data.links.info_title,
    //     infoSubTitle: responseOfLinkInfo.data.data.links.info_subtitle,
    //     playStore: responseOfLinkInfo.data.data.links.playstore_link,
    //   });
    // }
  };
  onSearchNearByRestaurants = async () => {
    if (this.state.searchBox) {
      this.setState({
        flag: false,
      });
      let userSearchData = {
        longitude: 72.992746,
        latitude: 21.719333,
        queryString: this.state.searchBox,
        items_in_page: 4,
        page_number: 1,
      };
      const response = await instance
        .post(requests.fetchNearByRestaurants, userSearchData)
        .catch((error) => {
          let errorMessage = error.response.data.error.message;
          NotificationManager.error(errorMessage);
        });
      if (response && response.data) {
        this.setState({
          Restaurants: response.data.data,
        });
      }
    } else {
      return NotificationManager.warning("Please, Enter The Searching Item");
    }
  };
  redirectDaynamic(name, id) {
    this.props.STORE_CITY(name);
    this.props.STORE_CITY_ID(id);
    const { history } = this.props;
    if (history) history.push(`/city/${name}`);
  }
  render() {
    let { selectedCityDetail } = this.state;
    //console.log("Image => ",this.state.city[0].city_image.image_url )
    return (
      <>
        <HomeHeader />
        <div>
          <Container>
            <Row>
              <Col
                sm={12}
                md={6}
                xl={6}
                lg={6}
                className="content-my wrap-text-welcome t-center"
              >
                <span className="tit2 t-center">
                  <h1>
                    {this.state.siteDesc} <br />
                    {/* <strong>Albany</strong>’s Best Restaurants */}
                    {this.state.headerTitle}
                  </h1>
                </span>
                <br />
                <p>{this.state.headerSubTitle}</p>
                <span className="description">
                  <strong>{i18next.t("Demo info")}</strong>: {i18next.t("Our demo restorants deliver in")}:
                  <a href="?location=Bronx,NY,USA">Bronx</a>,
                  <a href="?location=Manhattan, New York, NY, USA">Manhattn</a>
                </span>
                <hr />
                <form>
                  <Row classNameName="form-group d-flex justify-content-between">
                    {this.state.city.length > 0 ? (
                      <>
                        <Col lg={12} xl={6} sm={12} md={6}>
                          <div className="input-group ">
                            <div className="input-group-prepend">
                              {/* <span className="input-group-text">
                                <i className="ni ni-basket"></i>
                              </span> */}
                            </div>
                            <Dropdown
                              placeholder="Select City"
                              fluid
                              search
                              selection
                              clearable
                              name="selectedCity"
                              options={this.state.cityOB}
                              onChange={this.handleSelectChange}
                              // name="client"
                            />
                          </div>
                        </Col>
                        <Col lg={12} xl={6} sm={12} md={6}>
                          <div>
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => this.FindYourCity()}
                            >
                              {i18next.t("Find Your City")}
                            </button>
                          </div>
                        </Col>
                      </>
                    ) : (
                      <>
                        <Col lg={12} xl={6} sm={12} md={6}>
                          <div className="input-group ">
                            <Dropdown
                              placeholder={i18next.t("Select Country")}
                              fluid
                              search
                              selection
                              clearable
                              name="selectedCountry"
                              options={this.state.country}
                              onChange={this.handleSelectChange}
                              // name="client"
                            />
                          </div>
                        </Col>
                        <Col lg={12} xl={6} sm={12} md={6}>
                          <div>
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => this.GetCityWithoutToken()}
                            >
                              {i18next.t("Find your Country")}
                            </button>
                          </div>
                        </Col>
                      </>
                    )}
                  </Row>
                </form>
              </Col>
              <Col
                className="content-demo"
                sm={12}
                md={6}
                xl={6}
                lg={6}
                style={{
                  minHeight: "450px",
                  backgroundImage: `url(${sideImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center top",
                }}
              ></Col>
            </Row>
          </Container>
          {this.state.flag ? (
            <div className="city">
              <Row>
                <Col>
                  <div>
                    <h1>{i18next.t("Find us in this cities and many more..!")}</h1>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col className="city-list">
                  <Row>
                    {
                    !this.state.showSelectedCity ?   
                    this.state.city.map((name, index) => {
                      return (
                        <>
                          <Col lg="4" xl="3" sm="12" md="6">
                            <div
                              className="img-wrapper rounded"
                              key={index}
                              style={{
                                width: "280px",
                                height: "210px",
                                cursor: "pointer",
                                boxShadow: "0px 5px 10px 0px #d9d9d9",
                              }}
                              onClick={() =>
                                this.redirectDaynamic(name.city_name, name._id)
                              }
                            >
                              <img
                                className="inner-img"
                                src={
                                  name.city_image
                                    ? name.city_image.image_url
                                    : process.env.REACT_APP_DEFAULT_IMAGE
                                }
                                style={{
                                  width: "282px",
                                  height: "210px",
                                  objectFit: "cover",
                                  padding: "0px,",
                                }}
                              />
                              <div
                                className="bottom-left"
                                style={{ padding: "10px" }}
                              >
                                <strong> {name.city_name} </strong>
                              </div>
                            </div>
                          </Col>
                        </>
                      );
                    })
                    :
                    <Col lg="4" xl="3" sm="12" md="6">
                            <div
                              className="img-wrapper rounded"
                              key={selectedCityDetail.city_name}
                              style={{
                                width: "280px",
                                height: "210px",
                                cursor: "pointer",
                                boxShadow: "0px 5px 10px 0px #d9d9d9",
                              }}
                              onClick={() =>
                                this.redirectDaynamic(selectedCityDetail.city_name, selectedCityDetail._id)
                              }
                            >
                              <img
                                className="inner-img"
                                src={
                                  selectedCityDetail.city_image
                                    ? selectedCityDetail.city_image.image_url
                                    : process.env.REACT_APP_DEFAULT_IMAGE
                                }
                                style={{
                                  width: "282px",
                                  height: "210px",
                                  objectFit: "cover",
                                  padding: "0px,",
                                }}
                              />
                              <div
                                className="bottom-left"
                                style={{ padding: "10px" }}
                              >
                                <strong> {selectedCityDetail.city_name} </strong>
                              </div>
                            </div>
                          </Col>
                    }
                  </Row>
                  <br />
                  <br />
                </Col>
              </Row>
            </div>
          ) : (
            <div className="city">
              <Row>
                <Col>
                  <div>
                    <h1>{i18next.t("Please Find your Country ...!")} </h1>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col className="city-list">
                  <Row>
                    {this.state.Restaurants.map((hotel, index) => (
                      <>
                        <Col lg="4" xl="3" sm="12" md="6">
                          <div
                            className="img-wrapper"
                            style={{ width: "280px", height: "210px" }}
                          >
                            <img
                              className="inner-img"
                              src={imge}
                              style={{
                                width: "280px",
                                height: "210px",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          <div>
                            <strong> {hotel.restaurant_Name} </strong>
                            <p>{hotel.restaurant_Description}</p>
                            <p>
                              {i18next.t("Minimum Order")}: {hotel.restaurant_Minimum_order}
                            </p>
                          </div>
                        </Col>
                      </>
                    ))}
                  </Row>
                  <br />
                  <br />
                </Col>
              </Row>
            </div>
          )}

          <NotificationContainer />
        </div>
        <hr />
        <div className="container py-md tit2 t-center">
          <div className="row justify-content-between align-items-center">
            <div className="col-lg-6">
              <br />
              <br />
              <h2 className="display-3">{this.state.infoTitle}</h2>
              <h4 className="mb-0 font-weight-light display-5">
                {this.state.infoSubTitle}
              </h4>
            </div>
            <div className="col-lg-6 text-lg-center btn-wrapper">
              <div className="row">
                <div className="col-6">
                  <a href={this.state.playStore} target="_blank">
                    <img className="img-fluid" src={playstore} alt="..." />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
        <HomeFooter />
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
