import React from "react";
import instance from "../../../axios";
import requests from "../../../requests";
import i18next from "i18next";

import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import HomeHeader from '../header/HomeHeader.js';
import 'components/common/Home/home.css'
import sideImage from '../../../assets/img/theme/food-8.webp';
import imge from '../../../assets/img/theme/Food-2.png'
import { Link } from "react-router-dom"



import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Row,
    Col,
    Container
} from "reactstrap";
import { bindActionCreators } from "redux";
import { ActCreators } from "../../../redux/bindActionCreator";
import { connect } from "react-redux";

// Plastore Image
import playstore from "../../../assets/img/theme/play_store.png"

// Footer 
import HomeFooter from "../../../components/Footers/HomeFooter";

let cityGlobal = null;
let cityId = null;
const mapStateToProps = state => {
    cityGlobal = state.city
    cityId = state.cityId
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators(ActCreators, dispatch)
};


class CityResturant extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Restaurants: [],
            searchBox: '',
            flag: true,
            cityDetail:{},
            infoTitle:'',
            infoSubTitle:'',
            playStore:'',
            appStore:'',
        }
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    };
    getCityDetail = async () =>  {
        const response = await instance.get(requests.fetchCityDetail+cityId ).catch((error) => {
            let errorMessage = error.response.data.error.message;
            NotificationManager.error(errorMessage)
        });
        if (response && response.data) {
            this.setState({
                cityDetail: response.data.data.city ? response.data.data.city : {}
            })
        }
    }
    getLinkData = async () => {
         // Links Information API Integration
         let LinkId ={
            "link_id":"5f883e12f467716db0d5b5fc"
        }
        const responseOfLinkInfo = await instance.post(requests.fetchLinkDataForClient,LinkId).catch((error) => {
            let errorMessage = error.responseOfLinkInfo.data.error.message;
            NotificationManager.error(errorMessage)
        });
        if(responseOfLinkInfo && responseOfLinkInfo.data){
            this.setState({
                infoTitle:responseOfLinkInfo.data.data.links.info_title,
                infoSubTitle:responseOfLinkInfo.data.data.links.info_subtitle,
                playStore:responseOfLinkInfo.data.data.links.playstore_link,
            })
        }
    } 
    componentDidMount = async () => {
        let city = {
            "city": `${cityGlobal}`
        }
        const response = await instance.post(requests.fetchRestaurantsInCity, city).catch((error) => {
            let errorMessage = error.response.data.error.message;
            NotificationManager.error(errorMessage)
        });
        if (response && response.data) {
            this.setState({
                Restaurants: response.data.data
            })
        }
        this.getCityDetail();
        this.getLinkData();

        
    }
    onSearchNearByRestaurants = async () => {
        this.setState({
            flag: false
        })
        let userSearchData = {
            "longitude": 72.992746,
            "latitude": 21.719333,
            "queryString": this.state.searchBox,
            "items_in_page": 4,
            "page_number": 1
        }
        const response = await instance.post(requests.fetchNearByRestaurants, userSearchData).catch((error) => {
            let errorMessage = error.response.data.error.message;
            NotificationManager.error(errorMessage)
        });
        if (response && response.data) {
            this.setState({
                Restaurants: response.data.data
            })
        }
    }
    redirectRestaurant(restaurantName, id) {
        this.props.STORE_RESTAURANT(id);

        const { history } = this.props;
        if (history) history.push(`/restaurant/${restaurantName}`)
    }
    render() {
        return (
            <>
                <HomeHeader />
                <div >

                    <Container >
                        <Row>
                            <Col sm={12} md={6} xl={6} lg={6} className="content-my wrap-text-welcome t-center">
                                <span class="tit2 t-center">
                                    <h1>
                                        {/* Food Delivery from <br />
                                        <strong>{this.state.cityDetail.city_name}</strong>’s Best Restaurants */}
                                        {this.state.cityDetail.title}
                                    </h1>
                                </span><br />
                                    <p>{this.state.cityDetail.sub_title}</p>
                                <span class="description">
                                    <strong>{i18next.t("Demo info")}</strong>: {i18next.t("Our demo restorants deliver in")}:
                                    <a href="?location=Bronx,NY,USA">Bronx</a>,
                                    <a href="?location=Manhattan, New York, NY, USA">Manhattn</a>
                                </span>
                                <hr />
                                <form>
                                    <Row className="form-group d-flex justify-content-between">
                                        <Col lg={12} xl={6} sm={12} md={6}>
                                            <div class="input-group ">
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text"><i class="ni ni-basket"></i></span>
                                                </div>
                                                <input name="searchBox" class="form-control lg"
                                                    placeholder="Search" type="text"
                                                    value={this.state.searchBox}
                                                    onChange={(e) => this.handleChange(e)} />
                                            </div>
                                        </Col>

                                        <Col lg={12} xl={6} sm={12} md={6}>
                                            <div >
                                                <button type="button" class="btn btn-danger"
                                                    onClick={() => this.onSearchNearByRestaurants()}
                                                >
                                                    {i18next.t("Find your meal")}
                                            </button>
                                            </div>
                                        </Col>
                                    </Row>
                                </form>
                            </Col>
                            <Col className="content-demo" sm={12} md={6} xl={6} lg={6} style={{
                                minHeight: "450px",
                                backgroundImage: `url(${sideImage})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center top"
                            }}>

                            </Col>
                        </Row>
                    </Container>
                    {
                        this.state.flag
                        ? <div className="city">
                            <Row>
                                <Col>
                                    <div>
                                        <h1>{i18next.t("Restaurants in")} {cityGlobal}</h1>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="city-list">
                                    <Row>
                                        {
                                            this.state.Restaurants.length > 0
                                            ?
                                                this.state.Restaurants.map((hotel, index) => {
                                                    return (
                                                        <>
                                                            <Col lg="4" xl="3" sm="12" md="6" >
                                                                                                                               
                                                                <div className=" img-wrapper"
                                                                    style={{ cursor: 'pointer' }}
                                                                    key={index}
                                                                    style={{
                                                                        width: "280px",
                                                                        height: "210px", cursor: 'pointer'
                                                                    }}
                                                                    onClick={() => this.redirectRestaurant(hotel.restaurant_Name, hotel._id)}
                                                                >
                                                                    <img className="inner-img"
                                                                        src={hotel.restaurant_image ? hotel.restaurant_image.image_url : imge }
                                                                        style={{
                                                                            width: "280px",
                                                                            height: "210px",
                                                                            objectFit: "cover",
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div style={{
                                                                        width: "280px",
                                                                        height: "210px", cursor: 'pointer'
                                                                    }}>
                                                                    <div style={{ "justify-content": "space-between", "display": "flex" }}>
                                                                        <div>
                                                                        <h3>
                                                                            <strong> {hotel.restaurant_Name} </strong>
                                                                        </h3>
                                                                        </div>
                                                                        <div>
                                                                        <h3>
                                                                            <span>
                                                                                <i className="fa fa-star" style={{ color: "#dc3545" }}></i>
                                                                                <strong>
                                                                                    &nbsp; 
                                                                                    {
                                                                                        (hotel.restaurant_ratings) >= 0 ?
                                                                                            hotel.restaurant_ratings
                                                                                        :
                                                                                            0
                                                                                    } 
                                                                                    {
                                                                                        (hotel.total_reviews >= 0 ) ?
                                                                                            <span className="small"> / 5 ( {hotel.total_reviews} )</span>
                                                                                        :
                                                                                            <span className="small"> / 5 ( 0 )</span>
                                                                                    }
                                                                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                                                                </strong>
                                                                            </span>
                                                                        </h3>
                                                                        </div>
                                                                    </div>
                                                                    <p>{hotel.restaurant_Description}</p>
                                                                    <p>{i18next.t("Minimum Order")}: {hotel.restaurant_Minimum_order}</p>
                                                                </div>
                                                            </Col>
                                                        </>
                                                    )
                                                }
                                                )
                                            :
                                            <Col lg="4" xl="3" sm="12" md="6" >
                                                <h3> <p> {i18next.t("Hmmm... Restuarant not Found in this city...")}  </p>  </h3>
                                            </Col>
                                        }
                                    </Row>
                                    <br /><br />
                                </Col>
                            </Row>
                        </div>
                        : 
                        <div className="city">
                            <Row>
                                <Col>
                                    <div>
                                        <h1>{i18next.t("Restaurants where you can find")} {this.state.searchBox}</h1>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="city-list">
                                    <Row>
                                        {
                                            this.state.Restaurants.map((hotel, index) =>
                                                <>
                                                    <Col lg="4" xl="3" sm="12" md="6">
                                                        <div className="img-thumbnail img-wrapper"
                                                            style={{
                                                                width: "280px",
                                                                height: "210px",
                                                            }}
                                                        >
                                                            <img className="inner-img"
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
                                                            <p>{i18next.t("Minimum Order")}: {hotel.restaurant_Minimum_order}</p>
                                                        </div>
                                                    </Col>
                                                </>)
                                        }
                                    </Row>
                                    <br /><br />
                                </Col>
                            </Row>
                        </div>
                    }
                </div>
                <hr/>
            <div className="container py-md tit2 t-center">
                <div className="row justify-content-between align-items-center">
                    <div className="col-lg-6">
                        <br/><br/>
                        <h2 className="display-3">{this.state.infoTitle}</h2>
                        <h4 className="mb-0 font-weight-light display-5">
                            {this.state.infoSubTitle}
                        </h4>
                
                    </div>
                    <div className="col-lg-6 text-lg-center btn-wrapper">
                        <div className="row">
                            <div className="col-6">
                                <a href={this.state.playStore} target="_blank">
                                    <img className="img-fluid" src={playstore} alt="..." /></a>
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
            <br/><br/><br/><br/>
            <HomeFooter />
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CityResturant);
