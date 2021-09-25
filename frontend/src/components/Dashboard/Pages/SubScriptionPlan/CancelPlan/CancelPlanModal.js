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
import { ActCreators } from "../../../../../redux/bindActionCreator";
import { connect } from "react-redux";

import instance from "../../../../../axios";
import requests from "../../../../../requests";
import Loader from "../../../../common/Loader";



let token = null;
let userData = {};

const mapStateToProps = (state) => {
    token = state.token;
    userData = state.userData;
};
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(ActCreators, dispatch);
};


export class CancelPlanModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msg:""
        };
      }

   
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    onCloseCall = () => {
        this.props.onClose()
    }

    disablePlan = async () => {
        this.setState({
          LoaderShow:true
        }) 
        let apiBody = {
          "plan_id":this.props.disablePlan._id,
          "is_active": false,
          "message": this.state.msg,
          "stripe_product":{
          "id":this.props.disablePlan.stripe_product.id
        }
        };
        console.log("API Body ==> ", apiBody);
        const response = await instance
        .patch(requests.fetchDisablePlan, apiBody, {
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
                LoaderShow:false
            })
            NotificationManager.success("Success fully archive your plan");
            this.onCloseCall();
        }
    }

    componentDidMount () {
    }
   
    render() {
        const {msg} = this.state
        console.log("Props => ",this.props.disablePlan)
        return (
            <>
                <Modal className="modal-dialog-centered modal-lg" isOpen={this.props.show}>
                    <div className="modal-header">
                        <h3 className="modal-title " id="exampleModalLabel">
                        {i18next.t("Disable Your Plan...!")}
                        </h3>
                        <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={this.onCloseCall}
                        >
                        <span aria-hidden={true}>×</span>
                        </button>
                    </div>
                    <div className="modal-body p-0">
                        <Card className="bg-secondary shadow border-0">
                            <CardBody className="p-lg-5">
                                <Row>
                                    <div className="col">
                                    <Col md="12">
                                        <FormGroup>
                                        <label
                                            className="form-control-label"
                                            htmlFor="input-Cancellation Message"
                                        >
                                            {i18next.t("Cancellation Message")}
                                        </label>
                                        <div>
                                        <Input
                                            className="form-control-alternative"
                                            placeholder={i18next.t("Cancellation Message")}
                                            type="text"
                                            name="msg"
                                            value={msg}
                                            onChange={(e) => this.handleChange(e)}
                                        />
                                        </div>
                                        </FormGroup>
                                    </Col>
                          
                                    </div>
                                </Row>
                                <center>
                                <Row>
                                    <Col>
                                        <Button
                                            className="my-4"
                                            color="danger"
                                            type="button"
                                            onClick={() => {if(window.confirm('Are you sure you want to un-subscribe your plan?')) {this.disablePlan()}}}
                                        >
                                            {i18next.t("Un-Subscribe your plan")}
                                            </Button>
                                    </Col>    
                                </Row>
                                </center>   
                            </CardBody>
                        </Card>
                    </div>
                </Modal>
            </>
        )
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (CancelPlanModal)

