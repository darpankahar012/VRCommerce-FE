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
  CardTitle,
  CardFooter,
  Container,
  Row,
  Col,
  Label,
  Button,
  FormGroup,
  Form,
  Input,
  Modal
} from "reactstrap";

import Checkbox from 'rc-checkbox'

import Moment from "react-moment";
import moment from "moment"

import instance from "../../../../axios";
import requests from "../../../../requests";
import Loader from "../../../common/Loader";

import { Dropdown } from "semantic-ui-react";

// for Redux
import { bindActionCreators } from "redux";
import { ActCreators } from "../../../../redux/bindActionCreator";
import { connect } from "react-redux";

let userData = {};
let selectedPlan = {};
let token = null;


const mapStateToProps = state => {
  userData = state.userData;
  selectedPlan = state.selectedPlan;
  token = state.token;
  
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators(ActCreators, dispatch)
}


class EditSubscriptionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title:selectedPlan.title,
            content:selectedPlan.content,
        };
      }

   
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };
    componentDidMount () {
        
    }
    onCloseCall = () => {
        this.props.onClose();
    }

    updatePlan = async () => {
        this.setState({
            LoaderShow:true
        }) 
        let apiBody = {
            "plan_id":selectedPlan._id,
            "title": this.state.title,
            "content": this.state.content,
            "stripe_product": {
                "id": selectedPlan.stripe_product.id
            }
        };
        console.log("API Body ==> ", apiBody);
        const response = await instance
        .patch(requests.fetchUpdateSubscriptionPlan, apiBody, {
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
            this.onCloseCall();
        
        }
    }
    render() {
        const {countries, title, content} = this.state
        console.log("Selected Plan ==  ",selectedPlan)
        console.log("User Data ========",userData)
        return (
            <>
                <Modal className="modal-dialog-centered modal-lg" isOpen={this.props.show}>
                    <div className="modal-header">
                        <h3 className="modal-title " id="exampleModalLabel">
                        {i18next.t("Subscription Plan Information")}
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
                            <CardBody>
                                <Form>
                                    <h6 className="heading-small text-muted mb-4"></h6>
                                    <div className="pl-lg-4">
                                        <Row>
                                            <Col md="12">
                                            <FormGroup>
                                                <Label for="Name">{i18next.t("Title")}</Label>
                                                <Input
                                                    className="px-2 py-4"
                                                    type="text"
                                                    name="title"
                                                    value={title}   
                                                    onChange={this.handleChange}                                                 
                                                />
                                            </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12">
                                            <FormGroup>
                                                <Label for="Content">{i18next.t("Content")}</Label>
                                                <Input
                                                    className="px-2 py-4"
                                                    type="text"
                                                    placeholder={i18next.t("Content")}
                                                    name="content"
                                                    value={content}
                                                    onChange={this.handleChange}
                                                />
                                            </FormGroup>
                                            </Col>
                                        </Row>
                                    </div>
                                <center>
                                <div className="text-center my-">
                                    <Button
                                        className="my-3 p-3"
                                        color="primary"
                                        type="button"
                                        onClick={this.updatePlan}
                                    >
                                        {i18next.t('Update')}
                                    </Button>
                                </div>
                                </center>
                                </Form>
                            </CardBody>
                        </Card>
                    </div>
                </Modal>
            </>
        )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)  (EditSubscriptionModal)

