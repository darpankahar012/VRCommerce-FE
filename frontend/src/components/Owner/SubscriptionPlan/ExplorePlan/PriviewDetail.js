import React, {Component} from "react";
import axios from "axios";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import i18next from "i18next"
import {
  Card,
  CardHeader,
  CardBody,
  CardText,
  CardTitle,
  Row,
  Col,
  Button,
  FormGroup,
  Form,
  Input,
  Modal,
  ButtonGroup,
} from "reactstrap";

import Checkbox from 'rc-checkbox'

import Moment from "react-moment";
import moment from "moment"

import { bindActionCreators } from "redux";
import { ActCreators } from "../../../../redux/bindActionCreator";
import { connect } from "react-redux";

import instance from "../../../../axios";
import requests from "../../../../requests";
import Loader from "../../../common/Loader";

import "../ExplorePlan/ExplorePlan.css"


let token = null;
let userData = {};

const mapStateToProps = (state) => {
    token = state.token;
    userData = state.userData;
};
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(ActCreators, dispatch);
};

export class PreviewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            previewDetail:{},
            changeNow:true,
            unUsedAmount: "",
            unUsedTimeDescription: "",
            remainingTimeAmount: "",
            remainingDescription: "",
            total:null,
            showSummary:false
        };
      }

   
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    changeSubscription = async () => {
        this.setState({
            LoaderShow:true
        }) 
        let apiBody = {
            "change_now":this.state.changeNow,
            "new_plan_id": this.props.selectedPlan.stripe_price.id,
            "new_price": this.props.selectedPlan.stripe_price.id
        };
        console.log("API Body ==> ", apiBody);
        console.log("Requests.fetchChangeSubscription ",requests.fetchChangeSubscription);
        const response = await instance
        .patch(requests.fetchChangeSubscription, apiBody, {
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
            console.log("Response Preview Plan ==> ",response.data.data)
            this.setState({
                LoaderShow:false
            })
        }
    }

    previewData = async () => {
        this.setState({
            LoaderShow:true
        }) 
        let apiBody = {
            "new_stripe_price_id":this.props.selectedPlan.stripe_price.id
        };
        console.log("API Body ==> ", apiBody);
        const response = await instance
        .post(requests.fetchPreviewPlanDetail, apiBody, {
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
            console.log("Response Preview Plan ==> ",response.data.data)
            console.log("Length =>  ",response.data.data.lines.data.length)
            if(response.data.data.lines.data.length > 1)
            {
                this.setState({
                    previewDetail:response.data.data,
                    unUsedAmount: (response.data.data.lines.data[0].amount)/100 ,
                    unUsedTimeDescription: response.data.data.lines.data[0].description,
                    remainingTimeAmount: (response.data.data.lines.data[1].amount)/100,
                    remainingDescription: response.data.data.lines.data[1].description,
                    total: parseFloat((response.data.data.total)/100).toFixed(2)
                }, () => {
                    console.log("State After => ", this.state)
                    this.setState({
                        LoaderShow:false,
                        showSummary:true
                    })
                })
            }
            
        }
    }

    componentDidMount () {
        this.previewData();
    }

    handleCheckboxChange = event => {
        this.setState({ changeNow: event.target.checked })
      }
    
   
    render() {
        const {changeNow, unUsedAmount, unUsedTimeDescription,
            remainingTimeAmount, remainingDescription, total, previewDetail } = this.state;
        
        const { current_date_time } =  moment();
        

        console.log("Props selected Plan = ",this.props.selectedPlan.stripe_price.id)
        //console.log("USERDTATA =>",userData)
        const { current_period_end } =  moment.unix(userData.subscription_status.current_period_end);
        console.log("Moment Data => ",current_period_end)
        
        return (
            <>
                <Modal className="modal-dialog-centered modal-lg" isOpen={this.props.show}>
                    <div className="modal-header">
                        <h3 className="modal-title " id="exampleModalLabel">
                        {i18next.t("Preview Status")}
                        </h3>
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
                                <div className="col">
                                    <Row >
                                        <Col >
                                            <h3>
                                                Your plan Detail 
                                            </h3>    
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col  md={12} ld={12} sm={12} xs={12} lg={12}>
                                            <Row className="p-3">
                                                <Col md={4} ld={4} sm={4} xs={12} lg={4}>
                                                    <CardTitle className="display-5"> Title: {this.props.selectedPlan.title} </CardTitle>    
                                                </Col>
                                                <Col md={4} ld={4} sm={4} xs={12} lg={4}>
                                                    <CardTitle className="display-5"> 
                                                        Amount/Period:<br/>
                                                        {userData.currencies.symbol} {" "} 
                                                        {this.props.selectedPlan.unit_amount} 
                                                    </CardTitle>
                                                </Col>
                                            </Row>
                                            <Row className="p-3">
                                                <Col>
                                                    <h3> Features </h3>
                                                    <CardText>
                                                        {this.props.selectedPlan.content}
                                                    </CardText>
                                                </Col>
                                            </Row>
                                            <Row className="p-3">
                                                <Col>
                                                    <h3> When Your Subscription Plan Change...? </h3>
                                                </Col>
                                            </Row>
                                            <Row className="p-3">
                                                <Col>
                                                    <div style={{ fontFamily: 'system-ui' }}>
                                                        <label>
                                                        <Checkbox
                                                            checked={changeNow}
                                                            onChange={this.handleCheckboxChange}
                                                        />
                                                        <span style={{ marginLeft: 8 }}> Change Now</span>
                                                        </label>
                                                    </div>
                                                </Col>
                                            </Row>
                                            {
                                                this.state.showSummary && 
                                                    <Row className="p-3">
                                                        <Col className="p-3" md={12} ld={12} sm={12} xs={12} lg={12}>
                                                        <hr />
                                                            <h3> If you checked "Change Now" then your plan preview is below </h3>
                                                            <hr />
                                                            <h4> {unUsedAmount} {unUsedTimeDescription} </h4>
                                                            <h4> {remainingTimeAmount} {remainingDescription} </h4>
                                                            <hr className="new2"/>
                                                            <h4> {(unUsedAmount) + (remainingTimeAmount)} Proration Adjustment</h4>
                                                                
                                                            <h3>
                                                                When switching to new subscription now {" "}
                                                                <Moment format="Do MMM YYYY, hh:mm a">
                                                                    {current_date_time}
                                                                </Moment>  <br/>
                                                                </h3>
                                                                Next Invoice Generated With <strong>{parseFloat((total)).toFixed(2)} </strong> Amount 
                                                        </Col>
                                                    </Row>
                                            }
                                            <Row className="p-3"> 
                                                <Col>
                                                    <Button
                                                    color="primary"
                                                    onClick = {() => this.changeSubscription()}
                                                    >
                                                        Switch your Plan
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                            </Row>   
                            
                            </CardBody>
                        </Card>
                    </div>
                </Modal>
            </>
        )
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (PreviewDetail)

