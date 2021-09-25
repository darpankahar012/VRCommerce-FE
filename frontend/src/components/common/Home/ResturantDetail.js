import React, { Component } from "react";
import i18next from "i18next";
//
import { Button, Modal, FormGroup, Input,
Card, CardBody, Row ,Col , NavItem,
NavLink,TabContent,
TabPane,
Nav} from "reactstrap";

// for api integration
import instance from "../../../axios";
import requests from "../../../requests";

// for Redux
import { bindActionCreators } from "redux";
import { ActCreators } from "../../../redux/bindActionCreator";
import { connect } from "react-redux";
import classnames from "classnames";

// React Moment
import Moment from "react-moment";

// for notification
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

// Footer 
import HomeFooter from "components/Footers/HomeFooter";

let token = null;
let Addcategory = {};
let ownerId = null;

const mapStateToProps = (state) => {
  token = state.token;
  ownerId = state.ownerId;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};


export class ResturantDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity:'',
      navPills: 1,
      datas:[],
    };

  }
  toggleNavs = async (e, state, index,id) => {
    e.preventDefault();
    this.setState({
      [state]: index
    });
    let bodyAPI = {
      "ownerid": id,
    };
    const response = await instance
      .post(requests.fetchOwnerReview, bodyAPI, {
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
        datas: response.data.data.reviews
      })
    }
  }
  handleChange(e) {
    this.setState({
        [e.target.name]: e.target.value
    })
  };
  render() {
    return (
      <>
      <Row>
      <Col style={{width:"100px"}}>
        <Modal className="modal-dialog modal-lg modal-dialog-centered modal-" overlayClassName="Overlay" isOpen={this.props.show}>
          <div className="modal-header">
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={this.props.onClose}
            >
              <span aria-hidden={true}>×</span>
            </button>
          </div>
          <div className="modal-body p-0">
            <Card className="bg-secondary shadow border-0">
              <CardBody className="p-lg-5">
                <Row>
                    <Col md={12} lg={12} xs={12} xl={12}>
                        <div className="card-header bg-white text-center">
                            <img className="rounded" src={this.props.state.resturantDetail.restaurant_image ? this.props.state.resturantDetail.restaurant_image.image_url : "https://vrcommerce-image-storage.s3.us-east-2.amazonaws.com/default.jpg"} width="100px" height="100px" />
                            
                            
                            <h4 className="heading mt-4">
                              {this.props.state.resturantDetail.restaurant_Name} &nbsp;&nbsp; 
                              <span>
                                {
                                  (this.props.state.resturantDetail.restaurant_ratings) >= 0 &&
                                    <>
                                      <i className="fa fa-star" style={{color: "#dc3545"}}></i> 
                                      <strong> 
                                      &nbsp;
                                      {this.props.state.resturantDetail.restaurant_ratings}
                                      </strong>
                                      <span className="small"> / 5 
                                      ({ this.props.state.resturantDetail.total_reviews })
                                      </span> 
                                    </>
                                }
                              </span>
                            </h4>
                            <p className="description">{this.props.state.resturantDetail.restaurant_Description}</p>
                            <p className="description">Open: {this.props.state.currentDayWorking.openingTime } - {this.props.state.currentDayWorking.closingTime }</p>
                        </div>
                    </Col>
                </Row>
                <hr/>
                <Nav
                     className="nav-fill flex-column flex-md-row tabbable sticky "
                    // className="nav-pills"
                     pills role="tablist"
                >
                    <NavItem>
                        <NavLink
                            aria-selected={this.state.tabs === 1}
                            className={classnames("nav-item nav-item-category",{
                            active: this.state.tabs === 1
                            })}
                            onClick={e => this.toggleNavs(e, "tabs", 1)}
                            href="#pablo"
                            role="tab"
                        >
                            About
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            aria-selected={this.state.tabs === 2}
                            className={classnames("nav-item nav-item-category",{
                            active: this.state.tabs === 2
                            })}
                            onClick={e => this.toggleNavs(e, "tabs", 2,this.props.state.owner_id)}
                            href="#pablo"
                            role="tab"
                        >
                            Reviews
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.tabs} sm={12} md={12} xl={12} xs={12}>
                    <TabPane tabId={1}>
                        <Row>
                            <Col md={6} lg={6} xs={6} xl={6}>
                                <div class="card-header bg-transparent text-left">
                                    <p className="display-4"> Phone &nbsp;</p>
                                    <p className="display-5">{this.props.state.resturantDetail.phone}</p>
                                    {/* <p class="description">Open: 5:00 - 23:00</p> */}
                                </div>
                                <div className="card-header bg-transparent text-left">
                                    <p className="display-4"> Address &nbsp;</p>
                                    <p className="display-5">  {this.props.state.restaurantAddress} </p>
                                    {/* <p class="description">Open: 5:00 - 23:00</p> */}
                                </div>
                            </Col>
                            <Col md={6} lg={6} xs={6} xl={6}>
                                <br/>
                                <div className="card-header bg-white text-center">
                                    <h4 >The Brooklyn tree &nbsp;</h4>
                                    <p className="description">drinks, lunch, bbq</p>
                                    <p className="description">Open: 5:00 - 23:00</p>
                                </div>
                            </Col>
                        </Row>
                    </TabPane>
                    <br/>
                    <TabPane tabId={2}>
                      <Card className="bg-secondary shadow border-0">
                        <CardBody className="p-lg-5">
                          <Row>
                            <Col md={12} lg={12} xs={12} xl={12}>
                              
                                <div>  
                                  <div>
                                    <h1>{this.props.state.resturantDetail.total_reviews} Reviews</h1>
                                  </div>
                                  <hr/>
                                </div>
                                {
                                  this.state.datas.map((item,i) => {
                                    return(
                                      <>
                                      <div style={{ "justify-content": "space-between", "display": "flex" }}>
                                        <div>
                                          <strong> <h3> {item.clientuser.name} </h3></strong>
                                        </div>
                                        <h3>
                                            <span>
                                                <i className="fa fa-star" style={{ color: "#dc3545" }}></i>
                                                <strong>
                                                    &nbsp; 
                                                      {item.restaurant_ratings} (5)
                                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                                </strong>
                                            </span>
                                        </h3>
                                      </div>
                                      <span>
                                        <Moment format="Do MMM YYYY, hh:mm">
                                          {item.createdAt}
                                        </Moment></span><br/>
                                      <br/>
                                      <p> {item.comments} </p>
                                      <br/>
                                      </>
                                    )
                                  })
                                } 
                               </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </div>
        </Modal>
        </Col>
      </Row>
      <HomeFooter />
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResturantDetail);
