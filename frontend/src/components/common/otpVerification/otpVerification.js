import React, {Component} from 'react'
import axios from "axios";
import i18next from "i18next";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {bindActionCreators} from "redux";
import {ActCreators} from "../../../redux/bindActionCreator";
import {connect} from "react-redux";
import instance from "../../../axios";
import requests from "../../../requests";

// reactstrap components
import {
    Button,
    Card,
    CardBody,
    FormGroup,
    Form,
    Row,
    Col,
    Container
} from "reactstrap";
import './OtpVerification.css';
import OtpInput from 'react-otp-input';
import HomeHeader from "../header/HomeHeader";

let email = null;
const mapStateToProps = state => {
    email= state.email
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators(ActCreators, dispatch)
};

class otpVerification extends Component {
    constructor(props) {
        super(props)
        this.state = {
            otp: ''
        }
    }

    handleChange = otp => this.setState({otp});

    onOTP= async() => {
        let otpData = {
            "OTP": this.state.otp,
            "email": email
        };
        const {history} = this.props;
        const response = await instance.post(requests.fetchOTPverification, otpData).catch((error) => {
            let errorMessage = error.response.data.error.message;
            NotificationManager.error(errorMessage)
        });
        if (response && response.data) {
            const {history} = this.props;
            NotificationManager.success('OTP Verification Successfull..!');
            setTimeout(() => {
                history.push('/resetPassword')
            }, 1000);
        }
    }
    

    render() {
        return (
            <>
                <HomeHeader/>
                <div className="otp__verification">
                    <Container fluid>
                        <Row className="justify-content-center">
                            <Col lg="5" md="7">
                                <Card className="shadow border-5"
                                      style={{'backgroundColor': 'rgba(255, 255, 255, 0.7)'}}>
                                    <CardBody className="px-lg-5 py-lg-5">
                                        <div className="text-center text-muted mb-4">
                                            <h3>{i18next.t("OTP Verification")}</h3>
                                        </div>
                                        <Form role="form">
                                            <Row>
                                                <Col xs={12}>
                                                    <FormGroup className="mb-3">
                                                        <Col xs="12">
                                                            <OtpInput name="otp"
                                                                      value={this.state.otp}
                                                                      onChange={this.handleChange}
                                                                      numInputs={6}
                                                                      separator={<span
                                                                          className='separator__style'>-</span>}
                                                                      inputStyle={'otp__input'}
                                                                      containerStyle='otp__container'
                                                                      isInputNum={true}
                                                            />
                                                        </Col>
                                                    </FormGroup>
                                                </Col>
                                                <Col xs={12}>
                                                    <div className="text-center">
                                                        <Button className="my-4" color="primary" type="button" 
                                                           disabled = {!this.state.otp ? true : false}
                                                                onClick={() => this.onOTP()}>
                                                            {i18next.t("Verify OTP")}
                                                        </Button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <NotificationContainer/>
            </>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(otpVerification)
