import React from "react";
import axios from "axios";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { Link, Redirect } from "react-router-dom";

import {
  Card,
  CardHeader,
  CardBody,
  CardImg,
  CardTitle,
  CardText,
  Container,
  Row,
  Col,
  Label,
  Button,
  FormGroup,
  Form,
  Input,
} from "reactstrap";
import ReactDatetime from "react-datetime";
import HomeHeader from "../header/HomeHeader";
import instance from "../../../axios";
import requests from "../../../requests";

//Phone Number Input
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import i18next from "i18next";

//for Redux
import { bindActionCreators } from "redux";
import { ActCreators } from "../../../redux/bindActionCreator";
import { connect } from "react-redux";
import PaymentModal from "./Stripe/paymentModal";

import Loader from "../../common/Loader";

let userData = {};

const mapStateToProps = (state) => {
  userData = state.userData;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};
class StripePlan extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      plans: [],
      paymentModalShow: false,
      plan_id: "",
      price: "",
      trial_days: "",
      selectedPlan: {},
      interval: "",
      LoaderShow: true,
      userData: {},
    };
  }

  backToRegisterPgae = (flag) => {
    if (flag === true) {
      return <Redirect to="/restaurantRegistration" />;
    }
  };

  getPlan = async () => {
    this.setState({
      LoaderShow: true,
    });
    let apiBody = {
      country: userData.country_name,
    };
    const response = await instance.get(requests.fetchPlan).catch((error) => {
      console.log("Response => ", response);
      let errorMessage = error.message;
      NotificationManager.error(errorMessage);
    });
    if (response && response.data) {
      console.log("Response Plan ==> ", response.data);
      // _.each(response.data, function (data) {
      //   data.update = false;
      // });
      this.setState({
        plans: response.data.data,
        LoaderShow: false,
      });
      //   console.log("Response Plan ==> ", response.data.data[0].data);
      //   this.setState(
      //     {
      //       plans:
      //         response.data.data.length > 0 ? response.data.data[0].data : [],
      //     },
      //     () => {
      //       this.setState({
      //         LoaderShow: false,
      //       });
      //       console.log("Get Plan => ", this.state.plans);
      //     }
      //   );
    }
  };

  componentWillReceiveProps() {
    this.setState({
      userData: this.props.userData,
    });

    console.log("updatePlan", this.props.updatePlan);
  }
  componentDidMount() {
    console.log("Ownerdata", userData);
    console.log("props", this.props);

    this.getPlan();
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  selectPlan(selectedPlan) {
    console.log("Selected Plan Info == ", selectedPlan);
    this.props.SELECTED_PLAN_INFO(selectedPlan);
    this.setState(
      {
        selectedPlan: selectedPlan,
      },
      () => {
        this.setState({
          paymentModalShow: true,
        });
      }
    );
  }
  onClose = () => {
    this.setState({ paymentModalShow: false });
  };

  render() {
    console.log("updatePlan", this.props.updatePlan);
    return (
      <>
        {/* <HomeHeader /> */}
        <div className="main-content" ref="mainContent">
          <div
            className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
            style={{
              minHeight: "450px",
              backgroundImage:
                "url(" + require("assets/img/theme/Food-2.png") + ")",
              backgroundSize: "cover",
              backgroundPosition: "center top",
            }}
          >
            <Container className="d-flex align-items-center">
              <Row>
                <Col lg="7" md="10">
                  <h3 className="display-3 text-white"></h3>
                </Col>
              </Row>
            </Container>
          </div>
          <Container className="mt--7">
            <Loader open={this.state.LoaderShow} />
            <Row>
              <Col className="col">
                <Card className="bg-secondary shadow">
                  <CardHeader className="border-0">
                    <div className="d-flex justify-content-between">
                      <div className="md-7">
                        <h1 className="mb-0">{i18next.t("Plan Details")}</h1>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      {this.state.plans.map((data, index) => {
                        return (
                          <Col
                            className="p-3"
                            md={4}
                            ld={4}
                            sm={4}
                            xs={12}
                            lg={4}
                          >
                            <Card
                              style={{ borderWidth: 1, borderColor: "grey" }}
                            >
                              <CardBody>
                                <CardTitle className="display-3">
                                  {" "}
                                  {data.name}{" "}
                                </CardTitle>
                                <CardTitle className="display-4">
                                  $ {data.amount} / {data.duration}
                                </CardTitle>

                                <Button
                                  color="primary"
                                  onClick={() => this.selectPlan(data)}
                                >
                                  Select
                                </Button>
                                <br />
                                <br />
                                <CardTitle className="display-4">
                                  {" "}
                                  Features{" "}
                                </CardTitle>
                                <CardText>{data.description}</CardText>
                              </CardBody>
                            </Card>
                          </Col>
                        );
                      })}
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
          <NotificationContainer />
          <PaymentModal
            show={this.state.paymentModalShow}
            onClose={() => this.onClose()}
            state={this.state}
            userData={this.props.userData}
            update={this.props.updatePlan}
          />
        </div>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StripePlan);
