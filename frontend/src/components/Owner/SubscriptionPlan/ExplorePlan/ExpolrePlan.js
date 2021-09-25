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
import Loader from "../../../common/Loader";

// For Redux Data
import { bindActionCreators } from "redux";
import { ActCreators } from "../../../../redux/bindActionCreator";
import { connect } from "react-redux";
import instance from "../../../../axios";
import requests from "../../../../requests";

import Moment from "react-moment";
import moment from "moment";

import axios from "axios";

import { Dropdown } from "semantic-ui-react";

// core components
import AdminFooter from "../../../Footers/AdminFooter";
import Sidebar from "../../../Sidebar/Sidebar";

//Navbar
import Navbar from "../../../Navbars/AdminNavbar";

import routes from "../../../../ownerRoutes";

// Notification
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import PreviewDetail from "../ExplorePlan/PriviewDetail";

import "../ExplorePlan/ExplorePlan.css";

let token = null;
let userData = {};
let storeCurrentPlan = {};

const mapStateToProps = (state) => {
  token = state.token;
  userData = state.userData;
  storeCurrentPlan = state.storeCurrentPlan;
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};

class ExplorePlan extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Loader: true,
      plans: [],
      previewShow: false,
      planDetails: {},
      callGetSubscriptionPlan: false,
      Explore: false,
    };
  }

  handleClosePreviewModal = () => {
    this.setState({
      previewShow: false,
    });
  };

  getPlan = async () => {
    this.setState({
      LoaderShow: true,
    });
    let apiBody = {
      country: `${userData.country_name}`,
    };
    console.log("API Body ==> ", apiBody);
    const response = await instance
      .post(requests.fetchPlan, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        this.setState({
          LoaderShow: false,
        });
        console.log("Response => ", response);
        let errorMessage = error.message;
        NotificationManager.error(errorMessage);
      });
    if (response && response.data) {
      console.log("Response Plan ==> ", response.data.data);
      this.setState(
        {
          plans: response.data.data.length > 0 ? response.data.data : [],
        },
        () => {
          this.setState({
            LoaderShow: false,
          });
        }
      );
    }
  };

  selectPlan(selectedPlan) {
    console.log("Selected Plan Info == ", selectedPlan);
    //this.props.SELECTED_PLAN_INFO(selectedPlan);
    this.setState(
      {
        selectedPlan: selectedPlan,
      },
      () => {
        this.setState({
          previewShow: true,
        });
      }
    );
  }

  redirectToSubscriptionPlan = () => {
    const { history } = this.props;
    if (history) {
      history.push(`/subscriptionPlan`);
    }
  };

  componentDidMount = () => {
    this.getPlan();
  };

  render() {
    const {
      countries,
      plans,
      planDetails,
      callGetSubscriptionPlan,
    } = this.state;
    console.log("Current Plan = ", storeCurrentPlan);

    return (
      <>
        <Sidebar
          {...this.props}
          routes={routes}
          logo={{
            innerLink: "/admin/index",
            imgSrc: require("assets/img/brand/argon-react.png"),
            imgAlt: "...",
          }}
        />
        <div className="main-content" ref="mainContent">
          <Navbar />
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
                        <h1 className="mb-0">{i18next.t("Explore Plans")}</h1>
                      </div>
                      <div className="md-5">
                        <Row>
                          <Col>
                            <Button
                              color="primary"
                              size="sm"
                              onClick={this.redirectToSubscriptionPlan}
                            >
                              Back
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </CardHeader>
                  <Row>
                    <div className="col">
                      <Row className="p-3">
                        <Row className="p-3">
                          <Col>Select You Upgrade Plan</Col>
                        </Row>

                        {plans.map((country, i) => {
                          return (
                            <>
                              <Row className="p-3">
                                {country.data.map((plan, j) => {
                                  if (
                                    plan.is_active === true &&
                                    storeCurrentPlan.plan_id._id !== plan._id
                                  ) {
                                    return (
                                      <>
                                        <Col
                                          className="p-3"
                                          md={4}
                                          ld={4}
                                          sm={4}
                                          xs={12}
                                          lg={4}
                                        >
                                          <Card className="Plan mx-auto">
                                            <CardBody
                                              style={{
                                                pointerEvents: "auto",
                                                opacity: "1",
                                                cursor: "pointer",
                                              }}
                                              onClick={() =>
                                                this.selectPlan(plan)
                                              }
                                            >
                                              <CardTitle className="display-3">
                                                {" "}
                                                {plan.title}{" "}
                                              </CardTitle>
                                              <CardTitle className="display-4">
                                                {"userData.currencies.symbol"}{" "}
                                                {plan.unit_amount} /{" "}
                                                {
                                                  plan.stripe_price.recurring
                                                    .interval
                                                }
                                              </CardTitle>

                                              {/* <Button
                                                  color="primary"
                                                  
                                                >
                                                  Select
                                                </Button>
                                                <br/><br/> */}
                                              <CardTitle className="display-4">
                                                {" "}
                                                Features{" "}
                                              </CardTitle>
                                              <CardText>
                                                {plan.content}
                                              </CardText>
                                            </CardBody>
                                          </Card>
                                        </Col>
                                      </>
                                    );
                                  }
                                })}
                              </Row>
                            </>
                          );
                        })}
                      </Row>
                    </div>
                  </Row>
                </Card>
              </div>
            </Row>
            <NotificationContainer />
            {this.state.previewShow === true && (
              <PreviewDetail
                onClose={this.handleClosePreviewModal}
                show={this.state.previewShow}
                selectedPlan={this.state.selectedPlan}
              />
            )}
          </Container>
        </div>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExplorePlan);
