import React, {Component} from 'react'
import '../otpVerification/OtpVerification.css';
import axios from "axios";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {bindActionCreators} from "redux";
import {ActCreators} from "../../../redux/bindActionCreator";
import {connect} from "react-redux";
import instance from "../../../axios";
import requests from "../../../requests";
import i18next from "i18next";

import {
    Button,
    Card,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Row,
    Col,
    Container
} from "reactstrap";
import HomeHeader from "../header/HomeHeader";
import './ResetPassword.css'

let email = null;
const mapStateToProps = state => {
    email= state.email
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators(ActCreators, dispatch)
};

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Password: '',
            ConfirmPassword: ''
        }
    }

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    };

    onResetPassword= async() => {
        let resetPasswordUserData = {
            "email": email,
            "password":this.state.Password
        };
        const {history} = this.props;
        const response = await instance.patch(requests.fetchResetPassword, resetPasswordUserData).catch((error) => {
            let errorMessage = error.response.data.error.message;
            NotificationManager.error(errorMessage)
        });
        if (response && response.data) {
            const {history} = this.props;
            NotificationManager.success('Password Reset Successfull..!');
            setTimeout(() => {
                history.push('/')
            }, 1000);
        }

        /*
        axios.post(`http://199.43.206.194:6001/api/auth/password/reset`, resetPasswordUserData)
            .then(res => {
                NotificationManager.success('Email Sent');
                setTimeout(() => {
                    history.push('/otpVerification')
                }, 1000)
                console.log(res)
            }).catch((error) => {
            console.log(error)
        })*/
    }

    render() {
        const {Password,ConfirmPassword} = this.state;
        return (
            <>
                <HomeHeader/>
                <div className="reset_password">
                <Container fluid>
                    {/* Page content */}

                        <Row className="justify-content-center">
                            <Col lg="5" md="7">
                                <br/><br/>
                                <Card className="shadow border-5"
                                      style={{'background-color': 'rgba(255, 255, 255, 0.7)'}}>
                                    <CardBody className="px-lg-5 py-lg-5">
                                        <div className="text-center text-muted mb-4">
                                            <h3>{i18next.t("Reset Password")}</h3>
                                        </div>
                                        <Form role="form">
                                            <FormGroup>
                                                <InputGroup className="input-group-alternative">
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className="ni ni-lock-circle-open"/>
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <Input placeholder={i18next.t("New Password")} type="password"
                                                           autoComplete="new-password"
                                                           name="Password" value={this.state.Password}
                                                           onChange={this.handleChange}/>
                                                </InputGroup>
                                            </FormGroup>
                                            <FormGroup>
                                                <InputGroup className="input-group-alternative">
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className="ni ni-lock-circle-open"/>
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <Input placeholder={i18next.t("Confirm Password" )}type="password"
                                                           autoComplete="new-password" onChange={this.handleChange}
                                                           name="ConfirmPassword" value={this.state.ConfirmPassword}/>
                                                </InputGroup>
                                            </FormGroup>
                                            <div className="text-center">
                                                <Button className="my-4" color="primary" type="button"
                                                        disabled = {(!Password || !ConfirmPassword) ? true : false}
                                                        onClick={() => this.onResetPassword()}>
                                                    {i18next.t("Reset Password")}
                                                </Button>
                                            </div>
                                        </Form>
                                    </CardBody>
                                </Card>`
                            </Col>
                        </Row>
                </Container>
                </div>
                <NotificationContainer/>
            </>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)
