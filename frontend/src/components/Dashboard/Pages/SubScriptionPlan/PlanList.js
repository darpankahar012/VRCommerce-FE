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

import axios from "axios";

import { Dropdown } from "semantic-ui-react";

import CancelPlanModal from "../SubScriptionPlan/CancelPlan/CancelPlanModal";
// Notification
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import EditSubscriptionModal from "../SubScriptionPlan/EditSubscriptionModal";

let token = null;

const mapStateToProps = (state) => {
  token = state.token;
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};
class PlanList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Loader: true,
      datas: undefined,
      newPlanShow: false,
      countries: [],
      country: ["India"],
      plans: [],
      ShowEditModal: false,
      ShowCancellationModal: false,
      flagShowCancelModal: false,
      disablePlan: {},
    };
  }

  getOrsetCountries = () => {
    axios
      .get("https://restcountries.eu/rest/v2/?fields=name;")
      .then((response) => {
        console.log("Response Data=>", response);
        let country = response.data;
        let countries = [];
        country.map((item, i) => {
          let countryOB = {
            value: item.name,
            key: item.name,
            text: item.name,
          };
          countries.push(countryOB);
        });
        this.setState(
          {
            countries: countries,
          },
          () => {
            console.log("Countries State => ", this.state.countries);
          }
        );
      });
    this.setState({
      Loader: false,
    });
  };

  handleSelectChange = (e, data) => {
    this.setState(
      {
        [data.name]: data.value,
      },
      () => {
        console.log("this.state.country => ", this.state.country);
        this.getPlan(this.state.country.map((data) => data));
      }
    );
  };

  getPlan = async () => {
    this.setState({
      LoaderShow: true,
    });

    const response = await instance.get(requests.fetchPlan).catch((error) => {
      console.log("Response => ", response);
      let errorMessage = error.message;
      NotificationManager.error(errorMessage);
    });
    if (response && response.data) {
      console.log("Response Plan ==> ", response.data);
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

  // getPlan = async (Countries) => {
  //   if (Countries.length > 0) {
  //     this.setState({
  //       LoaderShow: true,
  //     });
  //     let apiBody = {
  //       country: `${Countries}`,
  //     };
  //     console.log("API Body ==> ", apiBody);
  //     const response = await instance
  //       .post(requests.fetchPlan, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .catch((error) => {
  //         this.setState({
  //           LoaderShow: false,
  //         });
  //         console.log("Response => ", response);
  //         let errorMessage = error.message;
  //         NotificationManager.error(errorMessage);
  //       });
  //     if (response && response.data) {
  //       console.log("Response Plan ==> ", response.data.data);
  //       this.setState(
  //         {
  //           plans: response.data.data.length > 0 ? response.data.data : [],
  //         },
  //         () => {
  //           this.setState({
  //             LoaderShow: false,
  //           });
  //         }
  //       );
  //     }
  //   }
  // };

  onCloseCancelPlan = () => {
    this.setState(
      {
        ShowCancellationModal: false,
        flagShowCancelModal: false,
      },
      () => {
        this.getPlan(this.state.country.map((data) => data));
      }
    );
  };

  componentDidMount = () => {
    this.getOrsetCountries();
    this.getPlan(this.state.country.map((data) => data));
  };

  createSubscriptionPlan = () => {
    const { history } = this.props;
    if (history) history.push("/subscriptionPlan/create");
  };

  editPlan = (selectedPlan) => {
    this.setState({
      flagShowEditModal: true,
      ShowEditModal: true,
    });
    console.log("Selected Plan Info == ", selectedPlan);
    this.props.SELECTED_PLAN_INFO(selectedPlan);
  };

  onCloseEditModal = () => {
    this.setState(
      {
        ShowEditModal: false,
        flagShowEditModal: false,
      },
      () => {
        this.getPlan(this.state.country.map((data) => data));
      }
    );
  };

  disablePlan = (selectedPlan) => {
    // this.props.SELECTED_PLAN_INFO(selectedPlan)
    this.setState({
      disablePlan: selectedPlan,
      flagShowCancelModal: true,
      ShowCancellationModal: true,
    });
  };

  render() {
    const { countries, plans } = this.state;
    const IsActive = {};
    const IsDisable = {
      pointerEvents: "none",
      opacity: "0.4",
    };

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
                      <h1 className="mb-0">
                        {i18next.t("Subscription Plans")}
                      </h1>
                    </div>
                    <div className="md-5">
                      <Row>
                        <Col>
                          <Button
                            color="primary"
                            size="sm"
                            type="button"
                            onClick={this.createSubscriptionPlan}
                          >
                            {i18next.t("Add New Subscription Plans")}
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </CardHeader>
                {/* <CardBody>
                  <Row>
                    <Col md={4} lg={4} xl={4} xs={12} sm={6}>
                      <FormGroup>
                        <Label for="DateFrom">
                          {" "}
                          {i18next.t("Filter By Country")}{" "}
                        </Label>
                        <InputGroup className="input-group-alternative">
                          <Dropdown
                            placeholder={i18next.t("Select Country")}
                            fluid
                            search
                            selection
                            clearable
                            multiple
                            name="country"
                            options={countries}
                            defaultValue={"India"}
                            onChange={this.handleSelectChange}
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody> */}
                <Row>
                  <div className="col">
                    <Row className="p-3">
                      {/* {this.state.plans.map((country, i) => {
                        return (
                          <>
                            <Row
                              className="p-3"
                              md={12}
                              ld={12}
                              sm={12}
                              xs={12}
                              lg={12}
                            >
                              <Col>
                                <h2>{country._id}</h2>
                              </Col>
                            </Row>
                            <Row
                              className="p-3"
                              md={12}
                              ld={12}
                              sm={12}
                              xs={12}
                              lg={12}
                            >
                              {country.data.map((plan, j) => {
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
                                      <Card>
                                        style={ plan.is_active===false ? {IsDisable} : {}}
                                        <CardBody
                                        style={{
                                          pointerEvents:
                                            plan.is_active === false
                                              ? "none"
                                              : "auto",
                                          opacity:
                                            plan.is_active === false
                                              ? "0.4"
                                              : "1",
                                        }}
                                        >
                                          {plan.is_active === true ? (
                                            <CardTitle className="display-3">
                                              {" "}
                                              {plan.title}{" "}
                                            </CardTitle>
                                          ) : (
                                          <CardTitle className="display-3">
                                            {" "}
                                            <del>{plan.name} </del>
                                          </CardTitle>
                                           )}
                                          <CardTitle className="display-4">
                                            {plan.hasOwnProperty(
                                              "currency_symbol"
                                            )
                                              ? plan.currency_symbol
                                              : "₹"}{" "}
                                            $ {plan.amount} / {plan.duration}
                                          </CardTitle>

                                          <Button
                                            color="primary"
                                            onClick={() => this.editPlan(plan)}
                                          >
                                            Edit
                                          </Button>
                                          <Button
                                            color="danger"
                                            onClick={() =>
                                              this.disablePlan(plan)
                                            }
                                          >
                                            Archive
                                          </Button>

                                          <br />
                                          <br />
                                          <CardTitle className="display-4">
                                            {" "}
                                            Features{" "}
                                          </CardTitle>
                                          <CardText>
                                            {plan.description}
                                          </CardText>
                                        </CardBody>
                                      </Card>
                                    </Col>
                                  </>
                                );
                              })}
                            </Row>
                          </>
                        );
                      })} */}

                      {this.state.plans.map((plan, j) => {
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
                              <Card>
                                {/* style={ plan.is_active===false ? {IsDisable} : {}} */}
                                <CardBody
                                // style={{
                                //   pointerEvents:
                                //     plan.is_active === false
                                //       ? "none"
                                //       : "auto",
                                //   opacity:
                                //     plan.is_active === false
                                //       ? "0.4"
                                //       : "1",
                                // }}
                                >
                                  {/* {plan.is_active === true ? (
                                            <CardTitle className="display-3">
                                              {" "}
                                              {plan.title}{" "}
                                            </CardTitle>
                                          ) : ( */}
                                  <CardTitle className="display-3">
                                    {" "}
                                    {plan.name}
                                  </CardTitle>
                                  {/* // )} */}
                                  <CardTitle className="display-4">
                                    {/* {plan.hasOwnProperty(
                                              "currency_symbol"
                                            )
                                              ? plan.currency_symbol
                                              : "₹"}{" "} */}
                                    $ {plan.amount} / {plan.duration}
                                  </CardTitle>

                                  <Button
                                    color="primary"
                                    // onClick={() => this.editPlan(plan)}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    color="danger"
                                    // onClick={() =>
                                    //   this.disablePlan(plan)
                                    // }
                                  >
                                    Archive
                                  </Button>

                                  <br />
                                  <br />
                                  <CardTitle className="display-4">
                                    {" "}
                                    Features{" "}
                                  </CardTitle>
                                  <CardText>{plan.description}</CardText>
                                </CardBody>
                              </Card>
                            </Col>
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
          {this.state.flagShowEditModal === true && (
            <EditSubscriptionModal
              show={this.state.ShowEditModal}
              onClose={() => this.onCloseEditModal()}
            />
          )}
          {this.state.flagShowCancelModal === true && (
            <CancelPlanModal
              show={this.state.ShowCancellationModal}
              onClose={() => this.onCloseCancelPlan()}
              disablePlan={this.state.disablePlan}
            />
          )}
        </Container>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlanList);
