import React from "react";
// react plugin used to create google maps
import i18next from "i18next";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  CardFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
  FormGroup,
  InputGroup,
  Table,
  Container,
  Row,
  Col,
  Label,
  Button,
} from "reactstrap";

import ReactDatetime from "react-datetime";
import Loader from "../../common/Loader";

// For Redux Data
import { bindActionCreators } from "redux";
import { ActCreators } from "../../../redux/bindActionCreator";
import { connect } from "react-redux";
import instance from "../../../axios";
import requests from "../../../requests";

import Moment from "react-moment";
import moment from "moment"

import {Redirect} from "react-router-dom"

import PaymentModal from "../../common/OwnerRgistration/Stripe/paymentModal";

import axios from "axios";

import { Dropdown } from "semantic-ui-react";
import "./ExplorePlan/ExplorePlan.css"
// Notification
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { CancelPlanModal } from "./ExplorePlan/CancelPlan/CancelPlanModal";

let token = null;
let userData = {};
let pageLinks = [];
let numberOfPages = 0;

const mapStateToProps = (state) => {
  token = state.token;
  userData = state.userData
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};
class SubscriptionPlan extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        Loader: true,

        flagOfUser:false,
        User:{},
        
        plans:[],
        planDetails:{},
        callGetSubscriptionPlan:false,
        Explore:false,
        Status:"",
        ShowCancellationModal:false,
        cancellationPlan:{},
        is_subscription_schedule:null
    };
  }


    getPlan = async () => {
        this.setState({
            LoaderShow:true
        }) 
        let apiBody = {
            "country": `${userData.country_name}`
        };
        console.log("API Body ==> ", apiBody);
        const response = await instance
        .post(requests.fetchPlan, apiBody, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .catch((error) => {
            this.setState({
                LoaderShow:false
            })
            console.log("Response => ",response)
            let errorMessage = error.message;
            NotificationManager.error(errorMessage);

        });
        if(response && response.data) {
            console.log("Response Plan ==> ",response.data.data)
            
            this.setState({
                plans: response.data.data.length > 0 ? response.data.data : []
            },() => {
                this.setState({
                    LoaderShow:false
                })
            })
        }
    }

    getUserInfo = async () => {
        this.setState({
            LoaderShow:true
        }) 
        const response = await instance
        .get(`${requests.fetchGetUserProfileData}/${userData._id}` , {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .catch((error) => {
            this.setState({
                LoaderShow:false
            })
            console.log("Response => ",response)
            let errorMessage = error.message;
            NotificationManager.error(errorMessage);

        });
        if(response && response.data) {
            console.log("===============================UserData Information ==> ",response.data.data.user)
            this.setState({
                flagOfUser:true,
                User:response.data.data.user,
                Status:response.data.data.user.subscription_status.status,
                LoaderShow:false
            })
            
        }
    }

    getSubscriptionPlan = async () => {
        this.setState({Loader:true})
        console.log("Token => ",token)
        console.log("URL =>",requests.fetchGetParticularOwnerSubscriptionPlan)
        const response = await instance
        .get(requests.fetchGetParticularOwnerSubscriptionPlan,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .catch((error) => {
            this.setState({
                LoaderShow:false
            })
            console.log("Response Get Subscription Plan => ",response)
            let errorMessage = error.message;
            NotificationManager.error(errorMessage);

        });
        if(response && response.data) {
            console.log("Response Plan ==> ",response.data.data)
            let storeCurrentPlan = response.data.data[0];
            this.props.STORE_CURRENT_PLAN(storeCurrentPlan);
            this.setState({planDetails: response.data.data}, () => {
                this.setState({
                    Loader:false,
                    callGetSubscriptionPlan:true
                })
            })
        }
    }
    
    createNewSubscriptionPlan = async (selectedPlan) => {
        console.log("Selected Plan Info == ",selectedPlan);
        let requestBody = {
            "plan_id": selectedPlan._id,
            "customer": userData.stripe_customer.id,
            "paymentMethodId": userData.stripe_customer.invoice_settings.default_payment_method,
            "price": selectedPlan.stripe_price.id,
          };
          console.log("Body == ", requestBody);
          const response = await instance
          .post(requests.fetchSubscribePlan, requestBody, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .catch((error) => {
            console.log("Response => ",error)
            let errorMessage = error.message;
            NotificationManager.error(errorMessage);
          });
          if(response && response.data) {
            console.log("Response Plan ==> ",response.data.data)
            this.setState({
              SubscriptionStatus:true
            })
            this.getSubscriptionPlan();
            NotificationManager.success("Subscription success fully done..");
          }


    }
    
    onCloseCancelPlan = () => {
        this.setState({ ShowCancellationModal: false },() =>{
            this.getUserInfo();
            this.getSubscriptionPlan();        
        });
    }

  componentDidMount = () => {
    this.getUserInfo();
    this.getPlan();
    this.getSubscriptionPlan();
  };

  redirectToExplore = () => {
      const { history } = this.props;
      if (history) {
        history.push(`/subscriptionPlan/explorePlan`);
      }
  }

  cancelSubscriptionPlan = (cancellationPlan,planType) => {
    this.setState({
        ShowCancellationModal:true,
        cancellationPlan:cancellationPlan,
        is_subscription_schedule: planType==="not_started" ? true : false
    })
  }

  render() {
    const { Status, User, countries, plans, planDetails, callGetSubscriptionPlan } = this.state;
    const { current_period_end } =  moment.unix(userData.subscription_status.current_period_end);
    console.log("Moment Data => ",current_period_end)
    console.log("UserData ============================= >",userData.currencies.symbol)
   
    if(this.state.Explore===true)
    {
        return (
            <Redirect to="/subscriptionPlan/explorePlan" />       
        )
    }
    
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
          <Loader open={this.state.LoaderShow} />
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <div className="d-flex justify-content-between">
                    <div className="md-7">
                      <h1 className="mb-0">{i18next.t("Subscription Plans")}</h1>
                      
                    </div>
                    <div className="md-5">
                      <Row>
                        <Col>
                          
                        </Col>
                      </Row>
                    </div>
                  </div>
                </CardHeader>
                {
                    Status === "no_plan_selected"  || Status === "canceled"
                    ?
                        <Row>
                            <div className="col">
                                <Row className="p-3">
                                    <Row className="p-3">
                                        <Col>
                                            <h4> Currently You have no plan. </h4>
                                            <h4> Please Select Your Subscription Plan. </h4>
                                        </Col>
                                    </Row>
                                    
                                    { 
                                        plans.map((country,i) => {
                                            return(
                                            <>
                                                <Row className="p-3">
                                                {
                                                country.data.map((plan,j) => {
                                                    if(plan.is_active===true){
                                                        return (
                                                            <>
                                                                <Col className="p-3" md={4} ld={4} sm={4} xs={12} lg={4}>
                                                                    <Card className="Plan mx-auto" >                                        
                                                                        <CardBody style={{ pointerEvents:"auto",opacity:"1", cursor:"pointer", }} onClick={() => {if(window.confirm('Are you sure you want to continue with selected plan?')) {this.createNewSubscriptionPlan(plan)}}}>
                                                                            <CardTitle className="display-3"> {plan.title} </CardTitle>
                                                                            <CardTitle className="display-4"> 
                                                                            {userData.currencies.symbol} {" "} 
                                                                            {plan.unit_amount} / {plan.stripe_price.recurring.interval} 
                                                                            </CardTitle>
                                                                            <CardTitle className="display-4"> Features </CardTitle>
                                                                            <CardText>
                                                                            {plan.content}
                                                                            </CardText>
                                                                                
                                                                        </CardBody>
                                                                    </Card>
                                                                </Col>
                                                            </>
                                                            )
                                                    }
                                                })
                                                }
                                                </Row>
                                            </>
                                            )
                                        })
                                    } 
                                </Row>
                            </div>
                        </Row>
                    :
                    callGetSubscriptionPlan === true &&
                    <Row>
                       <div className="col">
                            <Row className="p-3">
                                <Col className="p-3">
                                    <h3>
                                        Your All Plan Detail 
                                    </h3>    
                                </Col>
                            </Row>
                            <Row>
                                {
                                    planDetails.map((data,i) => {
                                        if(data.subscription_status==="canceled"){
                                            return(
                                                <Col className="p-3" md={12} ld={12} sm={12} xs={12} lg={12}>
                                                    <Card>
                                                        <CardBody style={{ pointerEvents: "auto",opacity: "1" }}>
                                                            <Row className="p-3">
                                                                <Col md={12} ld={12} sm={12} xs={12} lg={12}>
                                                                    <h2 className="RedFont"> Canceled Subscription Plan </h2>
                                                                </Col>
                                                            </Row>
                                                            <Row className="p-3">
                                                                <Col md={12} ld={12} sm={12} xs={12} lg={12}>
                                                                    <h3 className="RedFont"> Cancellation Reason: {data.cancellation_reason}  </h3>
                                                                </Col>
                                                            </Row>
                                        
                                                            <Row className="p-3">
                                                                <Col className="p-3" md={3} ld={3} sm={3} xs={12} lg={3}>
                                                                    <h3> Title: {data.plan_id.title} </h3>
                                                                </Col>
                                                                <Col className="p-3" md={3} ld={3} sm={3} xs={12} lg={3}>
                                                                    <h3> 
                                                                        Amount/Period:<br/>
                                                                        {userData.currencies.symbol} {" "} 
                                                                        {data.plan_id.unit_amount} / {data.plan_id.stripe_price.recurring.interval} 
                                                                    </h3>
                                                                </Col>
                                                                <Col className="p-3" md={3} ld={3} sm={3} xs={12} lg={3}>
                                                                   
                                                                </Col>
                                                                <Col className="p-3" md={3} ld={3} sm={3} xs={12} lg={3}>
                                                                                
                                                                </Col>
                                                            </Row>
                                                            <Row className="p-3">
                                                                <Col className="p-3" md={12} ld={12} sm={12} xs={12} lg={12}>
                                                                    <CardTitle className="display-4"> Features </CardTitle>
                                                                    <CardText>
                                                                        {data.plan_id.content}
                                                                    </CardText>
                                                                </Col>
                                                            </Row>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            )
                                        }
                                        else if (data.subscription_status==="deprecated") {
                                            return (
                                                <Col className=" p-3" md={12} ld={12} sm={12} xs={12} lg={12}>
                                                <Card>
                                                    <CardBody style={{ pointerEvents: "auto",opacity: "1" }}>
                                                        <Row className="p-3">
                                                            <h2 className="GreenFont"> Active Subscription Plan </h2>
                                                        </Row>
                                    
                                                        <Row className="p-3">
                                                            <Col className="p-3" md={3} ld={3} sm={3} xs={12} lg={3}>
                                                                <h3> Title: {data.plan_id.title} </h3>
                                                            </Col>
                                                            <Col className="p-3" md={3} ld={3} sm={3} xs={12} lg={3}>
                                                                <h3> 
                                                                    Amount/Period:<br/>
                                                                    {userData.currencies.symbol} {" "} 
                                                                    {data.plan_id.unit_amount} / {data.plan_id.stripe_price.recurring.interval} 
                                                                </h3>
                                                            </Col>
                                                            <Col className="p-3" md={3} ld={3} sm={3} xs={12} lg={3}>
                                                                <h3>
                                                                    Subscription Start Date:<br/>  
                                                                        {
                                                                            moment.unix(data.stripe_subscription_cycle.current_period_start).format('Do MMM YYYY, hh:mm a')
                                                                        }
                                                                </h3>
                                                            </Col>
                                                            <Col className="p-3" md={3} ld={3} sm={3} xs={12} lg={3}>
                                                                <h3>
                                                                    Subscription End Date:<br/>  
                                                                        {
                                                                            moment.unix(data.stripe_subscription_cycle.current_period_end).format('Do MMM YYYY, hh:mm a')
                                                                        }
                                                                </h3>            
                                                            </Col>
                                                        </Row>
                                                        <Row className="p-3">
                                                            <Col className="p-3" md={12} ld={12} sm={12} xs={12} lg={12}>
                                                                <CardTitle className="display-4"> Features </CardTitle>
                                                                <CardText>
                                                                    {data.plan_id.content}
                                                                </CardText>
                                                            </Col>
                                                        </Row>
                                                        {userData.subscription_status.status === "deprecated" 
                                                        ?
                                                            <Row className="p-3">
                                                                <Col md={3} ld={3} sm={3} xs={3} lg={3}>
                                                                    <Button
                                                                        color="primary"
                                                                        onClick={this.redirectToExplore}
                                                                    >
                                                                        Explore Your Plan
                                                                    </Button>
                                                                </Col>
                                                                <Col md={3} ld={3} sm={3} xs={3} lg={3}>
                                                                    <Button
                                                                        color="danger"
                                                                        onClick={() => this.cancelSubscriptionPlan(data,data.subscription_status)}
                                                                    >
                                                                        Cancel Your Plan
                                                                    </Button>
                                                                </Col>
                                                            </Row>
                                                        :
                                                            <Row className="p-3">
                                                                <Col className="p-3" md={12} ld={12} sm={12} xs={12} lg={12}>
                                                                    <h3> Note:</h3>
                                                                    <h4> 
                                                                        If scheduler plan is available then you can't unsubscribe.
                                                                        First you need to unsubscribe schedular plan.
                                                                    </h4>

                                                                </Col>
                                                            </Row>
                                                        }
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        )
                                        }
                                        else if (data.subscription_status==="not_started") {
                                            return (
                                                <Col className="p-3" md={12} ld={12} sm={12} xs={12} lg={12}>
                                                    <Card>
                                                        <CardBody style={{ pointerEvents: "auto",opacity: "1" }}>
                                                            <Row className="p-3">
                                                                <Col>
                                                                    <h2> Schedular Plan </h2>
                                                                    <h2 className="GrayFont"> This Plan Starting After Current Subscription Plan End...  </h2>
                                                                </Col>
                                                            </Row>
                                                            <Row className="p-3">
                                                                <Col className="p-3" md={3} ld={3} sm={3} xs={12} lg={3}>
                                                                    <h3> Title: {data.plan_id.title} </h3>
                                                                </Col>
                                                                <Col className="p-3" md={3} ld={3} sm={3} xs={12} lg={3}>
                                                                    <h3> 
                                                                        Amount/Period:<br/>
                                                                        {userData.currencies.symbol} {" "} 
                                                                        {data.plan_id.unit_amount} / {data.plan_id.stripe_price.recurring.interval} 
                                                                    </h3>
                                                                </Col>
                                                                <Col className="p-3" md={3} ld={3} sm={3} xs={12} lg={3}>
                                                                    
                                                                </Col>
                                                                <Col className="p-3" md={3} ld={3} sm={3} xs={12} lg={3}>
                                                                              
                                                                </Col>
                                                            </Row>
                                                            <Row className="p-3">
                                                                <Col md={3} ld={3} sm={12} xs={12} lg={3}>
                                                                    <Button
                                                                        color="danger"
                                                                        onClick={() => this.cancelSubscriptionPlan(data,data.subscription_status)}
                                                                    >
                                                                        Cancel Your Plan
                                                                    </Button>
                                                                </Col>
                                                            </Row>
                                                            <Row className="p-3">
                                                                <Col className="p-3" md={12} ld={12} sm={12} xs={12} lg={12}>
                                                                    <CardTitle className="display-4"> Features </CardTitle>
                                                                    <CardText>
                                                                        {data.plan_id.content}
                                                                    </CardText>
                                                                </Col>
                                                            </Row>
                                                            
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            )
                                        }
                                        else if (data.subscription_status==="active") {
                                            return (
                                                <Col className=" p-3" md={12} ld={12} sm={12} xs={12} lg={12}>
                                                    <Card>
                                                        <CardBody style={{ pointerEvents: "auto",opacity: "1" }}>
                                                            <Row className="p-3">
                                                                <h2 className="GreenFont"> Active Subscription Plan </h2>
                                                            </Row>
                                        
                                                            <Row className="p-3">
                                                                <Col className="p-3" md={3} ld={3} sm={3} xs={12} lg={3}>
                                                                    <h3> Title: {data.plan_id.title} </h3>
                                                                </Col>
                                                                <Col className="p-3" md={3} ld={3} sm={3} xs={12} lg={3}>
                                                                    <h3> 
                                                                        Amount/Period:<br/>
                                                                        {userData.currencies.symbol} {" "} 
                                                                        {data.plan_id.unit_amount} / {data.plan_id.stripe_price.recurring.interval} 
                                                                    </h3>
                                                                </Col>
                                                                <Col className="p-3" md={3} ld={3} sm={3} xs={12} lg={3}>
                                                                    <h3>
                                                                        Subscription Start Date:<br/>  
                                                                            {
                                                                                moment.unix(data.stripe_subscription_cycle.current_period_start).format('Do MMM YYYY, hh:mm a')
                                                                            }
                                                                    </h3>
                                                                </Col>
                                                                <Col className="p-3" md={3} ld={3} sm={3} xs={12} lg={3}>
                                                                    <h3>
                                                                        Subscription End Date:<br/>  
                                                                            {
                                                                                moment.unix(data.stripe_subscription_cycle.current_period_end).format('Do MMM YYYY, hh:mm a')
                                                                            }
                                                                    </h3>            
                                                                </Col>
                                                            </Row>
                                                            <Row className="p-3">
                                                                <Col className="p-3" md={12} ld={12} sm={12} xs={12} lg={12}>
                                                                    <CardTitle className="display-4"> Features </CardTitle>
                                                                    <CardText>
                                                                        {data.plan_id.content}
                                                                    </CardText>
                                                                </Col>
                                                            </Row>
                                                            <Row className="p-3">
                                                                <Col md={3} ld={3} sm={6} xs={12} lg={3}>
                                                                    <Button
                                                                        color="primary"
                                                                        onClick={this.redirectToExplore}
                                                                    >
                                                                        Explore Your Plan
                                                                    </Button>
                                                                </Col>
                                                                <Col md={3} ld={3} sm={6} xs={12} lg={3}>
                                                                    <Button
                                                                        color="danger"
                                                                        onClick={() => this.cancelSubscriptionPlan(data,data.subscription_status)}
                                                                    >
                                                                        Cancel Your Plan
                                                                    </Button>
                                                                </Col>
                                                            </Row>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            )
                                        }
                                        else if (data.subscription_status==="trialing") {
                                            return (
                                                <Col className=" p-3" md={12} ld={12} sm={12} xs={12} lg={12}>
                                                    <Card>
                                                        <CardBody style={{ pointerEvents: "auto",opacity: "1" }}>
                                                            <Row className="p-3">
                                                                <h2 className="GreenFont"> Active Subscription Plan </h2>
                                                            </Row>
                                        
                                                            <Row className="p-3">
                                                                <Col className="p-3" md={3} ld={3} sm={3} xs={12} lg={3}>
                                                                    <h3> Title: {data.plan_id.title} </h3>
                                                                </Col>
                                                                <Col className="p-3" md={3} ld={3} sm={3} xs={12} lg={3}>
                                                                    <h3> 
                                                                        Amount/Period:<br/>
                                                                        {userData.currencies.symbol} {" "} 
                                                                        {data.plan_id.unit_amount} / {data.plan_id.stripe_price.recurring.interval} 
                                                                    </h3>
                                                                </Col>
                                                                <Col className="p-3" md={3} ld={3} sm={3} xs={12} lg={3}>
                                                                    <h3>
                                                                        Subscription Start Date:<br/>  
                                                                            {
                                                                                moment.unix(data.stripe_subscription_cycle.current_period_start).format('Do MMM YYYY, hh:mm a')
                                                                            }
                                                                    </h3>
                                                                </Col>
                                                                <Col className="p-3" md={3} ld={3} sm={3} xs={12} lg={3}>
                                                                    <h3>
                                                                        Subscription End Date:<br/>  
                                                                            {
                                                                                moment.unix(data.stripe_subscription_cycle.current_period_end).format('Do MMM YYYY, hh:mm a')
                                                                            }
                                                                    </h3>            
                                                                </Col>
                                                            </Row>
                                                            <Row className="p-3">
                                                                <Col className="p-3" md={12} ld={12} sm={12} xs={12} lg={12}>
                                                                    <CardTitle className="display-4"> Features </CardTitle>
                                                                    <CardText>
                                                                        {data.plan_id.content}
                                                                    </CardText>
                                                                </Col>
                                                            </Row>
                                                            <Row className="p-3">
                                                                <Col className="p-3" md={3} ld={3} sm={12} xs={12} lg={3}>
                                                                    <Button
                                                                        color="primary"
                                                                        onClick={this.redirectToExplore}
                                                                    >
                                                                        Explore Your Plan
                                                                    </Button>
                                                                </Col>
                                                                <Col className="p-3" md={3} ld={3} sm={12} xs={12} lg={3}>
                                                                    <Button
                                                                        color="danger"
                                                                        onClick={() => this.cancelSubscriptionPlan(data,data.subscription_status)}
                                                                    >
                                                                        Cancel Your Plan
                                                                    </Button>
                                                                </Col>
                                                            </Row>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            )
                                        }
                                
                                    })
                                }
                            </Row>
                        </div>
                    </Row>   
                
                }
              </Card>
            </div>
          </Row>
          <NotificationContainer />
          <CancelPlanModal 
            show={this.state.ShowCancellationModal}
            onClose={() => this.onCloseCancelPlan()}
            cancellationPlan={this.state.cancellationPlan}
            is_subscription_schedule={this.state.is_subscription_schedule}
          />
        </Container>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionPlan);
